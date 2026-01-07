import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import { JWT_SECRET } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const token = (await cookies()).get('agribid-session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== 'FARMER') return NextResponse.json({ error: 'Access denied' }, { status: 403 });

        const body = await request.json();
        const { name, totalQuantity, qualityGrade, minPrice, biddingType, scheduledStartTime, scheduledDuration } = body;

        const farmer = await prisma.farmer.findUnique({
            where: { userId: payload.userId as string }
        });

        if (!farmer) return NextResponse.json({ error: 'Farmer profile not found' }, { status: 404 });

        let biddingStartTime = new Date();
        let biddingEndTime = new Date();

        if (biddingType === 'BULK') {
            if (Number(totalQuantity) <= 20) {
                return NextResponse.json({ error: 'Bulk quantity must be above 20kg' }, { status: 400 });
            }
            const duration = Number(scheduledDuration) || 8;
            if (duration > 10) return NextResponse.json({ error: 'Maximum bidding duration is 10 hours' }, { status: 400 });

            const [hours, minutes] = (scheduledStartTime || '09:00').split(':').map(Number);
            biddingStartTime.setHours(hours, minutes, 0, 0);

            // If already past this time today, schedule for tomorrow
            if (biddingStartTime <= new Date()) {
                biddingStartTime.setDate(biddingStartTime.getDate() + 1);
            }

            biddingEndTime = new Date(biddingStartTime);
            biddingEndTime.setHours(biddingEndTime.getHours() + duration);
        } else {
            // MINI: Starts in 2h, lasts 4h
            biddingStartTime.setHours(biddingStartTime.getHours() + 2);
            biddingEndTime = new Date(biddingStartTime);
            biddingEndTime.setHours(biddingEndTime.getHours() + 4);
        }

        const crop = await prisma.crop.create({
            data: {
                name,
                totalQuantity: Number(totalQuantity),
                availableQuantity: Number(totalQuantity),
                qualityGrade,
                minPrice: Number(minPrice),
                biddingType,
                biddingStartTime,
                biddingEndTime,
                scheduledStartTime: scheduledStartTime || (biddingType === 'BULK' ? '09:00' : null),
                scheduledDuration: biddingType === 'BULK' ? (Number(scheduledDuration) || 8) : null,
                farmerId: farmer.id,
            }
        });

        // Send alert to all retailers
        try {
            const retailers = await prisma.user.findMany({
                where: { role: 'RETAILER' }
            });

            if (retailers.length > 0) {
                const startTimeStr = biddingStartTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
                const dateStr = biddingStartTime.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' });

                await prisma.notification.createMany({
                    data: retailers.map(r => ({
                        userId: r.id,
                        title: `Upcoming ${biddingType} Bid: ${name}`,
                        message: `Bidding for ${totalQuantity}kg of ${name} starts on ${dateStr} at ${startTimeStr}. Stay tuned!`
                    }))
                });
            }
        } catch (notifErr) {
            console.error('Failed to send notifications:', notifErr);
        }

        return NextResponse.json(crop);
    } catch (error: any) {
        console.error('Create crop error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'ACTIVE';
        const name = searchParams.get('name');
        const grade = searchParams.get('grade');
        const type = searchParams.get('type');
        const sort = searchParams.get('sort') || 'endingSoon';
        const mine = searchParams.get('mine') === 'true';

        const token = (await cookies()).get('agribid-session')?.value;
        const { payload } = token ? await jwtVerify(token, JWT_SECRET).catch(() => ({ payload: null })) : { payload: null };

        // Maintenance: Auto-reschedule/terminate expired BULK crops with no bids
        const now = new Date();
        const expiredBulk = await prisma.crop.findMany({
            where: {
                biddingType: 'BULK',
                biddingStatus: 'ACTIVE',
                biddingEndTime: { lt: now },
                bids: { none: {} }
            }
        });

        for (const crop of expiredBulk) {
            if (crop.attemptNumber === 1) {
                // Reschedule for next day same time
                const nextStart = new Date(crop.biddingStartTime);
                nextStart.setDate(nextStart.getDate() + 1);
                const nextEnd = new Date(crop.biddingEndTime);
                nextEnd.setDate(nextEnd.getDate() + 1);

                await prisma.crop.update({
                    where: { id: crop.id },
                    data: {
                        biddingStartTime: nextStart,
                        biddingEndTime: nextEnd,
                        attemptNumber: 2
                    }
                });
                console.log(`[AgriBid] Crop ${crop.id} rescheduled for Day 2`);
            } else {
                // Terminate
                await prisma.crop.update({
                    where: { id: crop.id },
                    data: { biddingStatus: 'CLOSED', status: 'SOLD' } // Mark as sold/inactive to remove from search
                });
                console.log(`[AgriBid] Crop ${crop.id} terminated after 2 days of no bids`);
            }
        }

        let where: any = {};
        if (mine) {
            if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            const farmer = await prisma.farmer.findUnique({ where: { userId: payload.userId as string } });
            if (!farmer) return NextResponse.json({ error: 'Farmer profile not found' }, { status: 404 });
            where = { farmerId: farmer.id };
        } else {
            where = {
                status: 'ACTIVE',
                biddingStatus: 'ACTIVE',
                biddingEndTime: { gt: now },
                farmer: { user: { accountStatus: 'ACTIVE' } }
            };
        }

        if (name) where.name = { contains: name };
        if (grade) where.qualityGrade = grade;
        if (type) where.biddingType = type;

        let orderBy: any = {};
        if (sort === 'priceHigh') orderBy = { minPrice: 'desc' };
        else if (sort === 'priceLow') orderBy = { minPrice: 'asc' };
        else orderBy = { biddingEndTime: 'asc' };

        const crops = await prisma.crop.findMany({
            where,
            include: {
                farmer: { include: { user: { select: { trustScore: true } } } },
                bids: { orderBy: { pricePerKg: 'desc' }, take: 1 }
            },
            orderBy
        });

        return NextResponse.json(crops);
    } catch (error: any) {
        console.error('Fetch crops error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

