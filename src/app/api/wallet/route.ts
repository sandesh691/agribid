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

        let wallet = await prisma.wallet.findUnique({
            where: { userId: payload.userId as string },
            include: { transactions: { orderBy: { timestamp: 'desc' }, take: 20 } }
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId: payload.userId as string,
                    balance: 10000 // Starting balance for demo
                },
                include: { transactions: true }
            });
        }

        return NextResponse.json(wallet);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const token = (await cookies()).get('agribid-session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const { amount } = await request.json();

        const wallet = await prisma.$transaction(async (tx) => {
            const updatedWallet = await tx.wallet.update({
                where: { userId: payload.userId as string },
                data: { balance: { increment: Number(amount) } }
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: updatedWallet.id,
                    amount: Number(amount),
                    type: 'CREDIT',
                    description: 'Wallet Top-up'
                }
            });

            return updatedWallet;
        });

        return NextResponse.json(wallet);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
