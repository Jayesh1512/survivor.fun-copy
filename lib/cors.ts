import { NextResponse } from "next/server";

/**
 * CORS configuration for API routes
 * Set NEXT_PUBLIC_URL in your environment variables for production
 */
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_URL || '*';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

/**
 * Helper function to add CORS headers to a NextResponse
 */
export function corsHeaders<T>(response: NextResponse<T>): NextResponse<T> {
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

/**
 * Handle OPTIONS preflight requests
 */
export function handleOptions() {
    return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

/**
 * Create a NextResponse with CORS headers
 */
export function createCorsResponse<T = any>(data: T, init?: ResponseInit): NextResponse<T> {
    const response = NextResponse.json(data, init);
    return corsHeaders(response);
}
