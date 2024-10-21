"use client";

import { type ClientSafeProvider, signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook, FaDiscord, FaTwitter } from "react-icons/fa";
import { type IconType } from "react-icons/lib";
import { cn } from "~/components/utils";

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

export function OAuthProviderButton(props: { provider: ClientSafeProvider }) {
    const Icon = IconMap[props.provider.name.toLowerCase()]!;
    const color = ColorMap[props.provider.name.toLowerCase()]!;
    console.log(`bg-[${color}]`);

    return (
        <Button
            className={cn("flex flex-row items-center justify-center gap-4 px-6 py-6 pl-4")}
            style={{ backgroundColor: color }}
            onClick={() => signIn(props.provider.id)}
        >
            <Icon />
            Sign in with {props.provider.name}
        </Button>
    );
}
