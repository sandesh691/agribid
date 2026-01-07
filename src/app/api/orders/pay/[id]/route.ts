import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'agribid-secret-key-123456789');

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: bidId } = await params;
    const token = (await cookies()).get('agribid-session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== 'RETAILER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Find the transaction associated with this accepted bid
        const transaction = await prisma.transaction.findFirst({
            where: {
                retailerId: payload.userId as string,
                paymentStatus: 'PENDING', // CRITICAL: Only allow paying for pending transactions
                crop: {
                    bids: {
                        some: { id: bidId, status: 'ACCEPTED' } // Only allow paying for accepted bids
                    }
                }
            }
        });

        if (!transaction) {
            return NextResponse.json({ error: 'Order not found, already paid, or not yet accepted by farmer.' }, { status: 404 });
        }

        // 1. Check Wallet Balance
        const wallet = await prisma.wallet.findUnique({
            where: { userId: payload.userId as string }
        });

        if (!wallet || wallet.balance < transaction.totalAmount) {
            return NextResponse.json({
                error: `Insufficient balance. Required: ₹${transaction.totalAmount}, Current: ₹${wallet?.balance || 0}`
            }, { status: 400 });
        }

        // 2. Find Farmer Wallet
        const farmerUser = await prisma.farmer.findUnique({
            where: { id: transaction.farmerId },
            include: { user: true }
        });

        const farmerWallet = await prisma.wallet.findUnique({
            where: { userId: farmerUser?.userId }
        });

        // 3. Atomically update wallets and order status
        await prisma.$transaction(async (tx: any) => {
            // Re-verify transaction status inside the transaction to prevent race conditions
            const txCheck = await tx.transaction.findUnique({
                where: { id: transaction.id }
            });

            if (!txCheck || txCheck.paymentStatus !== 'PENDING') {
                throw new Error('Payment already processed');
            }

            // Deduct from retailer wallet
            await tx.wallet.update({
                where: { userId: payload.userId as string },
                data: { balance: { decrement: transaction.totalAmount } }
            });

            // Record Retailer Transaction
            await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: transaction.totalAmount,
                    type: 'DEBIT',
                    description: `Purchase: ${transaction.id.split('-')[0].toUpperCase()}`
                }
            });

            // Credit Farmer Wallet
            if (farmerWallet) {
                await tx.wallet.update({
                    where: { id: farmerWallet.id },
                    data: { balance: { increment: transaction.totalAmount } }
                });

                await tx.walletTransaction.create({
                    data: {
                        walletId: farmerWallet.id,
                        amount: transaction.totalAmount,
                        type: 'CREDIT',
                        description: `Sale Earning: ${transaction.id.split('-')[0].toUpperCase()}`
                    }
                });
            }

            // Update transaction
            await tx.transaction.update({
                where: { id: transaction.id },
                data: {
                    paymentStatus: 'RECEIVED',
                    orderStatus: 'COMPLETED'
                }
            });

            // Mark bid as paid
            await tx.bid.update({
                where: { id: bidId },
                data: { status: 'PAID' }
            });
        });

        return NextResponse.json({ success: true, message: 'Order successfully completed!' });
    } catch (error: any) {
        console.error(error);
        const message = error.message === 'Payment already processed'
            ? 'Payment already processed'
            : 'Failed to process payment';
        return NextResponse.json({ error: message }, { status: error.message === 'Payment already processed' ? 400 : 500 });
    }
}
