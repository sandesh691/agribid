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
        if (payload.role !== 'RETAILER') return NextResponse.json({ error: 'Only retailers can bid' }, { status: 403 });

        const body = await request.json();
        const { cropId, quantity, pricePerKg } = body;

        const crop = await prisma.crop.findUnique({
            where: { id: cropId },
            include: { farmer: true }
        });

        if (!crop || crop.status !== 'ACTIVE' || crop.biddingStatus !== 'ACTIVE') {
            return NextResponse.json({ error: 'This crop is no longer available for bidding' }, { status: 400 });
        }

        if (new Date() < new Date(crop.biddingStartTime)) {
            return NextResponse.json({ error: 'Bidding has not started yet' }, { status: 400 });
        }

        if (new Date() > new Date(crop.biddingEndTime)) {
            await prisma.crop.update({
                where: { id: cropId },
                data: { biddingStatus: 'CLOSED' }
            });
            return NextResponse.json({ error: 'Bidding period has ended' }, { status: 400 });
        }

        // Role-specific validation
        if (crop.biddingType === 'BULK') {
            const allowedBulk = [100, 250, 500, 750, 1000];
            // Allow if it's in the standard list OR if it's the full available quantity
            if (!allowedBulk.includes(Number(quantity)) && Number(quantity) !== crop.availableQuantity) {
                return NextResponse.json({ error: `Invalid bulk quantity. Fixed bulk sizes are ${allowedBulk.join(', ')} kg, or you can bid the full ${crop.availableQuantity} kg.` }, { status: 400 });
            }
        } else { // MINI
            if (Number(quantity) < 1 || Number(quantity) > 20) {
                return NextResponse.json({ error: 'Mini bids must be between 1 and 20 kg' }, { status: 400 });
            }
        }

        if (Number(quantity) > crop.availableQuantity) {
            return NextResponse.json({ error: 'Quantity exceeds available stock' }, { status: 400 });
        }

        if (Number(pricePerKg) < crop.minPrice) {
            return NextResponse.json({ error: 'Bid price cannot be lower than minimum price' }, { status: 400 });
        }

        const retailer = await prisma.retailer.findUnique({
            where: { userId: payload.userId as string }
        });

        if (!retailer) {
            return NextResponse.json({ error: 'Retailer profile not found' }, { status: 404 });
        }

        const bid = await prisma.bid.create({
            data: {
                cropId,
                retailerId: payload.userId as string,
                quantity: Number(quantity),
                pricePerKg: Number(pricePerKg),
            }
        });

        // Create notification for the farmer
        try {
            await (prisma as any).notification.create({
                data: {
                    userId: crop.farmer.userId,
                    title: 'New Bid Received! 📈',
                    message: `You received a new bid of ₹${pricePerKg}/kg for your ${crop.name}. Click to view details.`,
                    link: `/farmer/crops/${crop.id}`
                }
            });
        } catch (notifErr) {
            console.error('[AgriBid] Failed to send bid notification to farmer:', notifErr);
        }

        return NextResponse.json(bid);
    } catch (error: any) {
        console.error('Bid creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

