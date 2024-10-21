import { getProviders } from "next-auth/react";
import { OAuthProviderButton } from "./_components/provider-button";
import { ArrowBigLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export default async function SignIn() {
    const providers = await getProviders();
    const ProviderButtonList = providers
        ? Object.values(providers).map((provider, index) => (
              <OAuthProviderButton key={index} provider={provider} />
          ))
        : [];

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-menu-main dark:bg-dark-menu-main">
            <a className="absolute left-4 top-4" href="/">
                <Button
                    variant={"ghost"}
                    size={"default"}
                    className="flex flex-row items-center gap-1 text-base"
                >
                    <ArrowBigLeft />
                    Home
                </Button>
            </a>
            <div className="flex flex-col items-center gap-2 rounded-lg bg-menu-light p-8 dark:bg-dark-menu-light">
                <h1 className="text-xl font-bold">Sign In</h1>
                <div className="h-4" />
                {ProviderButtonList}
            </div>
        </div>
    );
}
