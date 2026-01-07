import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'agribid-secret-key-123456789');

export async function GET() {
    const token = (await cookies()).get('agribid-session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const crops = await prisma.crop.findMany({
            where: {
                status: { not: 'REMOVED' }
            },
            include: {
                farmer: {
                    include: {
                        user: {
                            select: { email: true }
                        }
                    }
                },
                bids: true
            },
            orderBy: { biddingStartTime: 'desc' }
        });

        return NextResponse.json(crops);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
