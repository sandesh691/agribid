import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import { JWT_SECRET } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const token = (await cookies()).get('agribid-session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const { amount, bankDetails } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const wallet = await prisma.wallet.findUnique({
            where: { userId: payload.userId as string }
        });

        if (!wallet || wallet.balance < amount) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        const updatedWallet = await prisma.$transaction(async (tx) => {
            const w = await tx.wallet.update({
                where: { userId: payload.userId as string },
                data: { balance: { decrement: Number(amount) } }
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: w.id,
                    amount: Number(amount),
                    type: 'DEBIT',
                    description: `Withdrawal to Bank (${bankDetails?.accountNumber?.slice(-4) || 'Account'})`
                }
            });

            return w;
        });

        return NextResponse.json({ message: 'Withdrawal successful', wallet: updatedWallet });
    } catch (error) {
        console.error('Withdrawal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

