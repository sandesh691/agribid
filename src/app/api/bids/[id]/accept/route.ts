import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'agribid-secret-key-123456789');

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bidId } = await params;
        const token = (await cookies()).get('agribid-session')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== 'FARMER') return NextResponse.json({ error: 'Only farmers can accept bids' }, { status: 403 });

        const bid = await prisma.bid.findUnique({
            where: { id: bidId },
            include: { crop: true }
        });

        if (!bid) return NextResponse.json({ error: 'Bid not found' }, { status: 404 });

        // Verify ownership
        const farmer = await prisma.farmer.findUnique({
            where: { userId: payload.userId as string }
        });
        if (!farmer || bid.crop.farmerId !== farmer.id) {
            return NextResponse.json({ error: 'You do not own this crop' }, { status: 403 });
        }

        if (bid.crop.availableQuantity < bid.quantity) {
            return NextResponse.json({ error: 'Not enough available quantity' }, { status: 400 });
        }

        // Transactional update
        const result = await prisma.$transaction(async (tx: any) => {
            // Update bid status
            await tx.bid.update({
                where: { id: bidId },
                data: { status: 'ACCEPTED' }
            });

            // Refetch crop to get actual latest quantity
            const currentCrop = await tx.crop.findUnique({ where: { id: bid.cropId } });
            const newQty = (currentCrop?.availableQuantity || 0) - bid.quantity;

            // Deduct quantity and update status
            const updatedCrop = await tx.crop.update({
                where: { id: bid.cropId },
                data: {
                    availableQuantity: { decrement: bid.quantity },
                    status: newQty <= 0 ? 'SOLD' : 'ACTIVE'
                }
            });

            // Create transaction record
            const transaction = await tx.transaction.create({
                data: {
                    cropId: bid.cropId,
                    farmerId: farmer.id,
                    retailerId: bid.retailerId,
                    quantityPurchased: bid.quantity,
                    pricePerKg: bid.pricePerKg,
                    totalAmount: bid.quantity * bid.pricePerKg,
                }
            });

            // Reject other bids for the same quantity if it was bulk? 
            // Actually Farmer can accept any bid. If quantity is remaining, crop stays active.

            return transaction;
        });

        return NextResponse.json({ message: 'Bid accepted successfully', result });
    } catch (error: any) {
        console.error('Accept bid error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
