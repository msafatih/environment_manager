import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Hero from "./Hero";
import Feature from "./Feature";
import Demo from "./Demo";
import RoleBased from "./RoleBased";
import CallToAction from "./CallToAction";

const Welcome = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    // Handle intersection observer to detect active section
    useEffect(() => {
        setIsLoaded(true);

        // Create intersection observer for scroll tracking
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.4 } // 40% visibility before triggering
        );

        // Observe all sections
        document.querySelectorAll("section[id]").forEach((section) => {
            observer.observe(section);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    // SEO meta data
    const metaDescription =
        "Environment Manager - The secure, centralized platform for managing application environments across your organization with confidence.";
    const metaKeywords =
        "environment management, application configuration, role-based access, devops tools";

    return (
        <GuestLayout>
            <Head title="Environment Manager - Simplified Environment Control">
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta
                    property="og:title"
                    content="Environment Manager - Simplified Environment Control"
                />
                <meta property="og:description" content={metaDescription} />
                <meta
                    property="og:image"
                    content="/assets/images/og-preview.jpg"
                />
                <meta property="og:type" content="website" />
                <link
                    rel="canonical"
                    href="https://environment-manager.example.com"
                />
            </Head>

            {/* Loading overlay */}
            {!isLoaded && (
                <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            )}

            {/* Page content */}
            <div
                className={`transition-opacity duration-500 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                }`}
            >
                {/* Hero Section */}
                <section id="hero">
                    <Hero />
                </section>

                {/* Main Features Section */}
                <section id="features">
                    <Feature />
                </section>

                {/* Interactive Demo Section */}
                <section id="demo">
                    <Demo />
                </section>

                {/* Role-based Access Section */}
                <section id="roles">
                    <RoleBased />
                </section>

                {/* Call to Action */}
                <section id="cta">
                    <CallToAction />
                </section>
            </div>

            {/* Navigation dots for sections */}
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
                <div className="flex flex-col gap-3">
                    {["hero", "features", "demo", "roles", "cta"].map(
                        (section) => (
                            <a
                                key={section}
                                href={`#${section}`}
                                aria-label={`Go to ${section} section`}
                                className={`w-3 h-3 rounded-full border border-indigo-600 transition-all duration-300 ${
                                    activeSection === section
                                        ? "bg-indigo-600 scale-125"
                                        : "bg-white hover:scale-110"
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById(section)
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                            />
                        )
                    )}
                </div>
            </div>
        </GuestLayout>
    );
};

export default Welcome;
