"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function usePreferredTheme() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return { theme: undefined, isDark: false };
    }

    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";

    return { theme: currentTheme, isDark, mounted };
}
