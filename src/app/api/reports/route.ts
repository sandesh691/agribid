import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'agribid-secret-key-123456789');

export async function POST(request: Request) {
    const token = (await cookies()).get('agribid-session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const { type, subject, description } = await request.json();

        if (!type || !subject || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const report = await prisma.report.create({
            data: {
                userId: payload.userId as string,
                type,
                subject,
                description,
                status: 'PENDING'
            }
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error('Report creation error:', error);
        return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
    }
}

export async function GET() {
    const token = (await cookies()).get('agribid-session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        const reports = await prisma.report.findMany({
            where: { userId: payload.userId as string },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reports);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}
