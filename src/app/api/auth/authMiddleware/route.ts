import { getServerAuthSession, type AuthMiddlewareResponse } from "~/server/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    const session = await getServerAuthSession();
    const response: AuthMiddlewareResponse = { data: { auth: !!session } };
    return Response.json(response);
}
