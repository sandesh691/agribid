import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'agribid-secret-key-123456789');

export async function GET() {
    try {
        const token = (await cookies()).get('agribid-session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);

        const orders = await prisma.transaction.findMany({
            where: { retailerId: payload.userId as string },
            include: {
                crop: true
            },
            orderBy: { timestamp: 'desc' }
        });

        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
