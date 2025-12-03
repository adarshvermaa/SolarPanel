"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [consent, setConsent] = useState(false);

    useEffect(() => {
        const savedConsent = localStorage.getItem("cookie_consent");
        if (savedConsent === null) {
            setShowBanner(true);
        } else if (savedConsent === "true") {
            setConsent(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie_consent", "true");
        setConsent(true);
        setShowBanner(false);
    };

    const declineCookies = () => {
        localStorage.setItem("cookie_consent", "false");
        setConsent(false);
        setShowBanner(false);
    };

    return (
        <>
            {consent && GA_ID && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
                    </Script>
                </>
            )}

            {showBanner && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-4 shadow-lg z-50">
                    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            We use cookies to improve your experience and analyze site traffic. By clicking "Accept", you consent to our use of cookies.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={declineCookies}
                                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                            >
                                Decline
                            </button>
                            <button
                                onClick={acceptCookies}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-yellow-500 transition-colors"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
