function withValidProperties(properties: Record<string, undefined | string | string[]>) {
    return Object.fromEntries(
        Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
    );
}

export async function GET() {
    const URL = process.env.NEXT_PUBLIC_URL as string;
    return Response.json({
        accountAssociation: {
            header: process.env.FARCASTER_HEADER,
            payload: process.env.FARCASTER_PAYLOAD,
            signature: process.env.FARCASTER_SIGNATURE,
        },
        "frame": {
            "version": "1",
            "name": "survivor.fun",
            "homeUrl": "https://survivor-fun.vercel.app",
            "webhookUrl": "https://survivor-fun.vercel.app/api/webhook",
            "noindex": process.env.ENVIRONMENT === "production" ? "false" : "true"
        }
    });
}
