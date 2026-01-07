import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

// Simple salt/hash logic for demo/production stability without native dependencies
const hashPassword = (password: string) => {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};

export async function POST(request: Request) {
    console.log('[AgriBid] Registration attempt received');
    try {
        const body = await request.json();
        const { email, password, role, businessName, gstId, adminSecret } = body;
        console.log(`[AgriBid] Registering user: ${email} as ${role}`);

        if (!email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Security check for Admin registration
        if (role === 'ADMIN') {
            const SECRET_KEY = process.env.ADMIN_REGISTRATION_SECRET || 'agribid-admin-2025';
            if (adminSecret !== SECRET_KEY) {
                console.warn(`[AgriBid] Unauthorized admin registration attempt for ${email}`);
                return NextResponse.json({ error: 'Invalid Admin Security Key' }, { status: 403 });
            }
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.warn(`[AgriBid] Registration failed: User ${email} already exists`);
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const passwordHash = hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role,
                verified: role === 'ADMIN', // Admins are auto-verified in this demo
                accountStatus: 'ACTIVE',
            },
        });

        console.log(`[AgriBid] User created with ID: ${user.id}. Creating profile...`);

        if (role === 'FARMER') {
            await prisma.farmer.create({
                data: { userId: user.id },
            });
        } else if (role === 'RETAILER') {
            await prisma.retailer.create({
                data: {
                    userId: user.id,
                    businessName: businessName || 'Unknown Business',
                    gstId: gstId || 'PENDING',
                },
            });
        }

        console.log(`[AgriBid] Registration successful for ${email}`);
        return NextResponse.json({ message: 'User created successfully', userId: user.id });
    } catch (error: any) {
        console.error('[AgriBid] Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
