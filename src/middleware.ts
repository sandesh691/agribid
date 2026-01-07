import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

import { JWT_SECRET } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('agribid-session')?.value;

    // 1. PUBLIC PATHS - Always allow
    const isPublicPath = pathname === '/' ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/about') ||
        pathname.startsWith('/terms') ||
        pathname.startsWith('/privacy') ||
        pathname.startsWith('/admin-setup') ||
        pathname.startsWith('/api/auth');

    if (isPublicPath) {
        return NextResponse.next();
    }

    // 2. UNAUTHORIZED CHECK
    if (!token) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userRole = payload.role as string;

        // 3. ROLE-BASED AUTHORIZATION
        if (pathname.startsWith('/farmer') && userRole !== 'FARMER') {
            return NextResponse.redirect(new URL('/denied', request.url));
        }
        if (pathname.startsWith('/retailer') && userRole !== 'RETAILER') {
            return NextResponse.redirect(new URL('/denied', request.url));
        }
        if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/denied', request.url));
        }

        // 4. API AUTHORIZATION (Optional but safer)
        if (pathname.startsWith('/api/crops') && userRole === 'RETAILER' && request.method === 'POST') {
            // Example: prevent retailers from posting crops
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const response = NextResponse.next();
        response.headers.set('x-user-id', payload.userId as string);
        response.headers.set('x-user-role', userRole);
        return response;
    } catch (error) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)'],
};
