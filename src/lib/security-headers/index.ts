import { NextResponse } from 'next/server';

export interface SecurityHeadersConfig {
  contentSecurityPolicy?: string;
  xFrameOptions?: string;
  xContentTypeOptions?: string;
  strictTransportSecurity?: string;
  referrerPolicy?: string;
  permissionsPolicy?: string;
  xXSSProtection?: string;
}

const defaultConfig: SecurityHeadersConfig = {
  contentSecurityPolicy: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "media-src 'self'",
    "object-src 'none'",
    "child-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  strictTransportSecurity: process.env.NODE_ENV === 'production' 
    ? 'max-age=31536000; includeSubDomains' 
    : undefined,
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: [
    'camera=()',
    'microphone=()', 
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '),
  xXSSProtection: '1; mode=block'
};

/**
 * Apply security headers to a response
 */
export function withSecurityHeaders(
  response: NextResponse, 
  config: SecurityHeadersConfig = {}
): NextResponse {
  const finalConfig = { ...defaultConfig, ...config };
  
  // Apply each header if configured
  Object.entries(finalConfig).forEach(([key, value]) => {
    if (value !== undefined) {
      const headerName = camelToKebab(key);
      response.headers.set(headerName, value);
    }
  });

  return response;
}

/**
 * Create a new response with security headers
 */
export function createSecureResponse(
  body?: BodyInit | null,
  init?: ResponseInit,
  config: SecurityHeadersConfig = {}
): NextResponse {
  const response = new NextResponse(body, init);
  return withSecurityHeaders(response, config);
}

/**
 * Convert camelCase to kebab-case for HTTP headers
 */
function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}