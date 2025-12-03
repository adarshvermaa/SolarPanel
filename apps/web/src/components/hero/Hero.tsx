"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(textRef.current?.children || [], {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out",
            })
                .from(imageRef.current, {
                    x: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                }, "-=0.4");

            // Floating animation for the image
            gsap.to(imageRef.current, {
                y: -20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative overflow-hidden bg-neutral-light dark:bg-neutral-dark pt-16 pb-20 lg:pt-24 lg:pb-32"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left Content */}
                    <div ref={textRef} className="flex-1 text-center lg:text-left">
                        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-secondary dark:text-white mb-6">
                            Power Your Home with <span className="text-primary">Solar Energy</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                            Access government subsidies, find certified installers, and switch to clean energy in Chhattisgarh. Save up to 50% on installation costs.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link
                                href="/schemes"
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-secondary bg-primary rounded-lg hover:bg-yellow-500 transition-colors w-full sm:w-auto"
                            >
                                Browse Schemes
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/calculator"
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-secondary bg-white border-2 border-neutral-200 rounded-lg hover:bg-neutral-50 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 transition-colors w-full sm:w-auto"
                            >
                                Calculate Savings
                            </Link>
                        </div>
                    </div>

                    {/* Right Image (SVG Placeholder) */}
                    <div ref={imageRef} className="flex-1 w-full max-w-lg lg:max-w-xl">
                        <div className="relative aspect-square lg:aspect-[4/3]">
                            {/* Abstract Solar House SVG */}
                            <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl">
                                <defs>
                                    <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#0F172A" />
                                        <stop offset="100%" stopColor="#1E293B" />
                                    </linearGradient>
                                    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.1" />
                                        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Background Elements */}
                                <circle cx="350" cy="50" r="40" fill="#FFB400" opacity="0.2" />
                                <path d="M0 250 Q 200 200 400 250 L 400 300 L 0 300 Z" fill="url(#skyGrad)" />

                                {/* House Structure */}
                                <path d="M50 200 L 200 100 L 350 200 L 350 300 L 50 300 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />

                                {/* Solar Panels */}
                                <g transform="translate(80, 130) skewX(-20)">
                                    <rect x="0" y="0" width="160" height="80" fill="url(#panelGrad)" rx="4" />
                                    <line x1="0" y1="20" x2="160" y2="20" stroke="#334155" strokeWidth="1" />
                                    <line x1="0" y1="40" x2="160" y2="40" stroke="#334155" strokeWidth="1" />
                                    <line x1="0" y1="60" x2="160" y2="60" stroke="#334155" strokeWidth="1" />
                                    <line x1="40" y1="0" x2="40" y2="80" stroke="#334155" strokeWidth="1" />
                                    <line x1="80" y1="0" x2="80" y2="80" stroke="#334155" strokeWidth="1" />
                                    <line x1="120" y1="0" x2="120" y2="80" stroke="#334155" strokeWidth="1" />
                                </g>

                                {/* Decorative Elements */}
                                <circle cx="320" cy="180" r="4" fill="#22C55E" />
                                <circle cx="330" cy="180" r="4" fill="#22C55E" />
                                <rect x="310" y="220" width="30" height="40" fill="#CBD5E1" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
