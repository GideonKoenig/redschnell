import { getProviders } from "next-auth/react";
import { OAuthProviderButton } from "./_components/provider-button";
import { ArrowBigLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { AuthError } from "~/app/auth/signin/_components/error-box";

export default async function AuthSignIn() {
    const providers = await getProviders();
    const ProviderButtonList = providers
        ? Object.values(providers).map((provider, index) => (
              <OAuthProviderButton key={index} provider={provider} />
          ))
        : [];

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-menu-main dark:bg-dark-menu-main">
            <a className="absolute left-4 top-4 z-10" href="/">
                <Button
                    variant={"ghost"}
                    size={"default"}
                    className="flex flex-row items-center gap-1 bg-menu-main text-base dark:bg-dark-menu-main"
                >
                    <ArrowBigLeft />
                    Home
                </Button>
            </a>
            <div className="relative flex flex-col items-center gap-2 rounded-lg bg-menu-light p-8 dark:bg-dark-menu-light">
                <AuthError />
                <h1 className="text-xl font-bold">Sign In</h1>
                <div className="h-4" />
                {ProviderButtonList}
            </div>
        </div>
    );
}
