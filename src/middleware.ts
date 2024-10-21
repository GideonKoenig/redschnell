import { type NextRequest, NextResponse } from "next/server";
import { type AuthMiddlewareResponse } from "~/server/auth";

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();

    const authURL = `${url.origin}/api/auth/authMiddleware`;
    const response = (await fetch(authURL, {
        headers: req.headers,
    }).then((res) => res.json())) as AuthMiddlewareResponse;

    url.search = new URLSearchParams(`callbackUrl=${url.toString()}`).toString();
    url.pathname = `/api/auth/signin`;

    return !response.data.auth ? NextResponse.redirect(url) : NextResponse.next();
}

export const config = {
    matcher: ["/app/:path*"],
};
