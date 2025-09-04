import {auth as middleware} from '@/auth';
import { NextResponse } from 'next/server';
import { withSecurityHeaders } from '@/lib/security-headers';

const signInPathName = '/login';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default middleware((req) => {
    const {nextUrl} = req;

    const isAuthenticated = !!req.auth;

    // Handle authentication
    let response: NextResponse | null = null;
    
    // Prevent login redirect loop
    if (nextUrl.pathname === signInPathName) {
        response = NextResponse.next();
    } else if (!isAuthenticated) {
        response = NextResponse.redirect(new URL(signInPathName, nextUrl));
    } else {
        response = NextResponse.next();
    }

    // Apply security headers to all responses
    if (response) {
        return withSecurityHeaders(response);
    }

    return null;
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
