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

        const userId = payload.userId as string;

        // Fetch transactions (successful bids)
        const transactions = await prisma.transaction.findMany({
            where: { retailerId: userId },
            include: {
                crop: {
                    include: {
                        farmer: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            },
            orderBy: { timestamp: 'desc' }
        });

        // Fetch all bids (active and history)
        const bids = await prisma.bid.findMany({
            where: { retailerId: userId },
            include: {
                crop: true
            },
            orderBy: { timestamp: 'desc' }
        });

        // Fetch wallet balance
        const wallet = await prisma.wallet.findUnique({
            where: { userId }
        });

        // Calculate stats
        const totalSpent = transactions.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const activeBidsCount = bids.filter(b => b.status === 'PENDING').length;
        const successfulBidsCount = transactions.length;

        // Group by month for chart (last 6 months)
        const monthlySpending = Array.from({ length: 6 }).map((_, i) => {
            const date = new Date();
            date.setDate(1); // Avoid overflow issues on 31st
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const amount = transactions
                .filter(t => {
                    const tDate = new Date(t.timestamp);
                    return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
                })
                .reduce((acc, curr) => acc + curr.totalAmount, 0);
            return { month: monthName, amount };
        }).reverse();

        return NextResponse.json({
            transactions: transactions.slice(0, 5), // Recent successful bids
            bids: bids.slice(0, 5), // Recent bidding details
            totalSpent,
            activeBidsCount,
            successfulBidsCount,
            monthlySpending,
            totalBidsCount: bids.length,
            walletBalance: wallet?.balance || 0
        });
    } catch (error) {
        console.error('Retailer stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

