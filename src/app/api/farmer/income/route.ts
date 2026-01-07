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

        const farmer = await prisma.farmer.findUnique({
            where: { userId: payload.userId as string }
        });

        if (!farmer) {
            return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
        }

        const transactions = await prisma.transaction.findMany({
            where: { farmerId: farmer.id },
            include: {
                crop: true
            },
            orderBy: { timestamp: 'desc' }
        });

        // Calculate stats
        const totalEarnings = transactions.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const pendingPayments = transactions.filter(t => t.paymentStatus !== 'RECEIVED').reduce((acc, curr) => acc + curr.totalAmount, 0);

        // Group by month for chart (simple last 6 months)
        const monthlyEarnings = Array.from({ length: 6 }).map((_, i) => {
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

        // Fetch wallet balance
        const wallet = await prisma.wallet.findUnique({
            where: { userId: payload.userId as string }
        });

        return NextResponse.json({
            transactions,
            totalEarnings,
            pendingPayments,
            monthlyEarnings,
            walletBalance: wallet?.balance || 0
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
