import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface CSRFConfig {
  cookieName?: string;
  headerName?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
  httpOnly?: boolean;
}

const defaultConfig: CSRFConfig = {
  cookieName: '__Host-csrf',
  headerName: 'x-csrf-token',
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true
};

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify CSRF token from request
 */
export function verifyCSRFToken(
  request: NextRequest,
  config: CSRFConfig = {}
): boolean {
  const cfg = { ...defaultConfig, ...config };
  
  // Skip CSRF check for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }

  // Get token from cookie
  const cookieToken = request.cookies.get(cfg.cookieName!)?.value;
  if (!cookieToken) {
    return false;
  }

  // Get token from header or body
  const headerToken = request.headers.get(cfg.headerName!);
  
  // Validate tokens match
  if (!headerToken || cookieToken !== headerToken) {
    return false;
  }

  return true;
}

/**
 * CSRF protection middleware
 */
export async function withCSRFProtection(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  config: CSRFConfig = {}
): Promise<NextResponse> {
  const cfg = { ...defaultConfig, ...config };
  
  // Verify CSRF token
  if (!verifyCSRFToken(request, config)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }

  // Process request
  const response = await handler();

  // Generate new token for GET requests
  if (request.method === 'GET') {
    const token = generateCSRFToken();
    response.cookies.set({
      name: cfg.cookieName!,
      value: token,
      httpOnly: cfg.httpOnly,
      secure: cfg.secure,
      sameSite: cfg.sameSite,
      path: '/'
    });
  }

  return response;
}

/**
 * Get CSRF token from cookies (client-side safe)
 */
export function getCSRFToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const match = document.cookie.match(new RegExp('(^| )__Host-csrf=([^;]+)'));
  return match ? match[2] : null;
}