import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'agribid-secret-key-123456789');

async function checkAdmin() {
    const token = (await cookies()).get('agribid-session')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== 'ADMIN') return null;
        return payload;
    } catch {
        return null;
    }
}

export async function GET() {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const users = await prisma.user.findMany({
            where: { role: { in: ['FARMER', 'RETAILER'] } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
