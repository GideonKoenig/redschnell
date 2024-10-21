import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { getProviders } from "next-auth/react";
import { OAuthProviderButton } from "./_components/provider-button";

export default async function SignIn() {
    const session = await getServerAuthSession();
    if (session?.user) redirect("/app");

    const providers = await getProviders();
    const ProviderButton = providers
        ? Object.values(providers).map((provider, index) => (
              <OAuthProviderButton key={index} provider={provider} />
          ))
        : [];

    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            {ProviderButton}
        </div>
    );
}
