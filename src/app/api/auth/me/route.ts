import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import { JWT_SECRET } from '@/lib/auth';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('agribid-session')?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 200 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);

        return NextResponse.json({
            authenticated: true,
            user: {
                id: payload.userId,
                role: payload.role,
                email: payload.email
            }
        });
    } catch (error) {
        return NextResponse.json({ authenticated: false }, { status: 200 });
    }
}

