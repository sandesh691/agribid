import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'agribid-secret-key-123456789');

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = (await cookies()).get('agribid-session')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Check if there are any transactions linked to this crop
        const transactionCount = await prisma.transaction.count({
            where: { cropId: id }
        });

        if (transactionCount > 0) {
            // If transactions exist, don't delete the record to maintain history
            // Instead, mark it as REMOVED so it doesn't show in active listings
            await prisma.crop.update({
                where: { id },
                data: {
                    status: 'REMOVED',
                    biddingStatus: 'CLOSED'
                }
            });
            return NextResponse.json({ success: true, message: 'Crop marked as REMOVED due to existing transactions.' });
        }

        // Use a transaction to clean up bids first
        await prisma.$transaction([
            prisma.bid.deleteMany({
                where: { cropId: id }
            }),
            prisma.crop.delete({
                where: { id }
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
