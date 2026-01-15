import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

import { JWT_SECRET } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('agribid_session_v3')?.value;

    const publicPaths = ['/login', '/register', '/about', '/terms', '/privacy', '/admin-setup', '/denied'];
    const isPublicPath = pathname === '/' || publicPaths.some(p => pathname.startsWith(p));

    // Handle static assets and internal requests
    if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    if (!token || token.length < 10) {
        if (isPublicPath) return NextResponse.next();
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET, { clockTolerance: '5 minutes' });
        const userRole = payload.role as string;

        if (pathname === '/login' || pathname === '/register') {
            const dashboard = userRole === 'FARMER' ? '/farmer' : (userRole === 'RETAILER' ? '/retailer' : '/admin');
            return NextResponse.redirect(new URL(dashboard, request.url));
        }

        if (pathname.startsWith('/farmer') && userRole !== 'FARMER') return NextResponse.redirect(new URL('/denied', request.url));
        if (pathname.startsWith('/retailer') && userRole !== 'RETAILER') return NextResponse.redirect(new URL('/denied', request.url));
        if (pathname.startsWith('/admin') && userRole !== 'ADMIN') return NextResponse.redirect(new URL('/denied', request.url));

        const response = NextResponse.next();
        response.headers.set('x-user-id', String(payload.userId));
        response.headers.set('x-user-role', userRole);
        return response;
    } catch (err) {
        if (isPublicPath) return NextResponse.next();
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('agribid_session_v3');
        return response;
    }
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)'],
};
