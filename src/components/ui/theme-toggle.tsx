"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "~/components/control/theme-provider";
import { Button } from "~/components/ui/button";

export function ThemeToggle() {
    const { setTheme, themes, theme } = useTheme();
    return (
        <Button
            variant="ghost"
            size="icon"
            onMouseDown={() => {
                const nextThemeIndex =
                    (themes.findIndex((e) => e === theme()) + 1) % 3;
                setTheme(themes[nextThemeIndex]!);
            }}
        >
            <Sun
                data-state={theme()}
                className="hidden data-[state=light]:inline"
            />
            <Moon
                data-state={theme()}
                className="absolute hidden data-[state=dark]:inline"
            />
            <Monitor
                data-state={theme()}
                className="absolute hidden data-[state=system]:inline"
            />
        </Button>
    );
}
