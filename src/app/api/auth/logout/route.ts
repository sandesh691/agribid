import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    cookieStore.set('agribid-session', '', { path: '/', maxAge: 0 });
    return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}
