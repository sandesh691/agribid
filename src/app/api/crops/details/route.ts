import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'agribid-secret-key-123456789');

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        const crop = await prisma.crop.findUnique({
            where: { id },
            include: {
                bids: {
                    include: {
                        retailer: {
                            select: {
                                email: true,
                                trustScore: true,
                                retailerProfile: {
                                    select: {
                                        businessName: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { pricePerKg: 'desc' }
                },
                farmer: {
                    include: {
                        user: {
                            select: {
                                trustScore: true
                            }
                        }
                    }
                }
            }
        });

        if (!crop) return NextResponse.json({ error: 'Crop not found' }, { status: 404 });

        return NextResponse.json(crop);
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
