"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook, FaDiscord, FaTwitter } from "react-icons/fa";
import { type IconType } from "react-icons/lib";
import { cn } from "~/components/utils";
import { useSearchParams } from "next/navigation";

const IconMap: Record<string, IconType> = {
    google: FcGoogle,
    github: FaGithub,
    facebook: FaFacebook,
    discord: FaDiscord,
    twitter: FaTwitter,
};

const ColorMap: Record<string, string> = {
    google: "rgb(255, 255, 255)",
    github: "rgb(0, 0, 0)",
    facebook: "rgb(37, 106, 255)",
    discord: "rgb(114, 137, 218)",
    twitter: "rgb(29, 162, 242)",
};

const TextColorMap: Record<string, string> = {
    google: "rgb(0, 0, 0)",
    github: "rgb(255, 255, 255)",
    facebook: "rgb(255, 255, 255)",
    discord: "rgb(255, 255, 255)",
    twitter: "rgb(255, 255, 255)",
};

export function OAuthProviderButton(props: {
    provider: { name: string; id: string };
}) {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";

    const Icon = IconMap[props.provider.name.toLowerCase()]!;
    const color = ColorMap[props.provider.name.toLowerCase()]!;
    const textColor = TextColorMap[props.provider.name.toLowerCase()]!;

    return (
        <Button
            className={cn(
                "flex w-60 flex-row items-center gap-4 px-6 py-6 pl-4",
            )}
            style={{ backgroundColor: color, color: textColor }}
            onClick={() => signIn(props.provider.id, { callbackUrl })}
        >
            <Icon />
            Sign in with {props.provider.name}
        </Button>
    );
}
