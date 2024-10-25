"use client";

import { useSearchParams } from "next/navigation";
import { CircleX } from "lucide-react";

export function AuthError() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    if (!error) return;

    const errorMap: Record<string, string> & Record<"default", string> = {
        Signin: "Try signing in again.",
        OAuthSignin: "Error in constructing an authorization URL.",
        OAuthCallback:
            "Error in handling the response from the authorization server.",
        OAuthCreateAccount:
            "Could not create OAuth provider user in the database.",
        EmailCreateAccount:
            "Could not create email provider user in the database.",
        Callback: "Error in the OAuth callback handler route.",
        OAuthAccountNotLinked:
            "To confirm your identity, sign in with the same account you used originally.",
        EmailSignin: "Check your email inbox.",
        CredentialsSignin:
            "Sign in failed. Check the details you provided are correct.",
        SessionRequired: "Please sign in to access this page.",
        default: "Unable to sign in.",
    };
    const errorMessage = errorMap[error] ?? errorMap.default;

    return (
        <div className="absolute bottom-full mb-2 flex w-full flex-row items-center gap-3 rounded-lg bg-red-500 p-2 text-sm text-white">
            <div className="">
                <CircleX className="stroke-[2]" />
            </div>

            <p className="drop-shadow-2xl">{errorMessage}</p>
        </div>
    );
}
