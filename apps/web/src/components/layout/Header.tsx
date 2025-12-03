"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Search } from "lucide-react";
import gsap from "gsap";

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const headerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setMounted(true);
        if (headerRef.current) {
            gsap.from(headerRef.current, {
                y: -20,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
            });
        }
    }, []);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/schemes", label: "Schemes" },
        { href: "/apply", label: "Apply" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <header
            ref={headerRef}
            className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm"
        >
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-secondary dark:text-white flex items-center gap-2">
                    <span className="text-primary">☀</span>
                    SolarGov CG
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Search & Theme Toggle */}
                <div className="hidden md:flex items-center gap-4">
                    <form action="/schemes" method="get" className="relative">
                        <input
                            type="search"
                            name="search"
                            placeholder="Search schemes..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            aria-label="Search schemes"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    </form>

                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-neutral-700" />
                            )}
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
                    ) : (
                        <Menu className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <ul className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li className="pt-2">
                            <form action="/schemes" method="get" className="relative">
                                <input
                                    type="search"
                                    name="search"
                                    placeholder="Search schemes..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent dark:text-white"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                            </form>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
