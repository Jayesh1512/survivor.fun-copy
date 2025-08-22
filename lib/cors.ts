import { NextResponse } from "next/server";

/**
 * CORS configuration for API routes
 * Fully open: allow any origin, any headers, common methods.
 */
const ALLOWED_ORIGIN = '*';

const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
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
export function handleOptions(request?: Request) {
    const headers: Record<string, string> = { ...CORS_HEADERS };
    if (request) {
        const requestedHeaders = request.headers.get('Access-Control-Request-Headers');
        const requestedMethod = request.headers.get('Access-Control-Request-Method');
        if (requestedHeaders) headers['Access-Control-Allow-Headers'] = requestedHeaders;
        if (requestedMethod) headers['Access-Control-Allow-Methods'] = requestedMethod;
    }
    return new NextResponse(null, { status: 204, headers });
}

/**
 * Create a NextResponse with CORS headers
 */
export function createCorsResponse<T = any>(data: T, init?: ResponseInit): NextResponse<T> {
    const response = NextResponse.json(data, init);
    return corsHeaders(response);
}
