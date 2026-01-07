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

        // Use raw query to bypass potential Prisma client type mismatch
        const userId = payload.userId as string;
        const notifications = await prisma.$queryRawUnsafe(
            `SELECT * FROM "Notification" WHERE "userId" = ? ORDER BY "createdAt" DESC LIMIT 20`,
            userId
        );

        return NextResponse.json(notifications);
    } catch (error: any) {
        console.error('Notifications fetch error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const token = (await cookies()).get('agribid-session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const { id } = await request.json();

        await (prisma.notification.update as any)({
            where: { id, userId: payload.userId as string },
            data: { read: true }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

