import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'agribid-secret-key-123456789');

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
