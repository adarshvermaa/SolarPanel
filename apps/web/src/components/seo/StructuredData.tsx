import Script from "next/script";

export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SolarGov CG",
    url: "https://solargov-cg.example",
    logo: "https://solargov-cg.example/icon.svg",
    contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-1800-123-4567",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
    },
    sameAs: [
        "https://facebook.com/solargovcg",
        "https://twitter.com/solargovcg",
        "https://instagram.com/solargovcg",
    ],
};

export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SolarGov CG",
    url: "https://solargov-cg.example",
    potentialAction: {
        "@type": "SearchAction",
        target: "https://solargov-cg.example/schemes?search={search_term_string}",
        "query-input": "required name=search_term_string",
    },
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "How do I apply for solar subsidy in Chhattisgarh?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "You can apply online through the SolarGov CG portal. Check your eligibility, register, and submit your application with necessary documents.",
            },
        },
        {
            "@type": "Question",
            name: "What is the subsidy amount for rooftop solar?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The subsidy amount varies based on system capacity. Typically, it is up to 40% for systems up to 3kW and 20% for systems between 3kW and 10kW.",
            },
        },
        {
            "@type": "Question",
            name: "Who is eligible for the solar pump scheme?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Farmers with irrigation land and a valid connection (or off-grid requirement) are eligible. Priority is given to small and marginal farmers.",
            },
        },
    ],
};

export default function StructuredData() {
    return (
        <>
            <Script
                id="schema-org"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }}
            />
            <Script
                id="schema-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}
