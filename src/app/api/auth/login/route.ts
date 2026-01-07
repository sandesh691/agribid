import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { scryptSync, timingSafeEqual } from 'node:crypto';

import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const verifyPassword = (password: string, storedHash: string) => {
    if (!storedHash || !storedHash.includes(':')) {
        console.warn('[AgriBid] Legacy or invalid password hash detected. Verification failed.');
        return false;
    }
    const [salt, hash] = storedHash.split(':');
    const targetHash = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(targetHash, 'hex'));
};

import { JWT_SECRET } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                farmerProfile: true,
                retailerProfile: true,
            }
        });

        if (!user || !verifyPassword(password, user.passwordHash)) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (user.accountStatus === 'SUSPENDED') {
            return NextResponse.json({ error: 'Your account has been suspended. Please contact admin.' }, { status: 403 });
        }

        const token = await new SignJWT({
            userId: user.id,
            role: user.role,
            email: user.email
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        const cookieStore = await cookies();
        cookieStore.set('agribid-session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
        });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                verified: user.verified,
                trustScore: user.trustScore,
                language: user.language
            }
        });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
