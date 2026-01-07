import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import { JWT_SECRET } from '@/lib/auth';

export async function GET() {
    try {
        const token = (await cookies()).get('agribid-session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== 'RETAILER') return NextResponse.json({ error: 'Access denied' }, { status: 403 });

        const bids = await prisma.bid.findMany({
            where: {
                retailerId: payload.userId as string,
            },
            include: {
                crop: {
                    select: {
                        name: true,
                        biddingStatus: true,
                        status: true,
                    }
                }
            },
            orderBy: { timestamp: 'desc' }
        });

        return NextResponse.json(bids);
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

