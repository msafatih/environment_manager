"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const GuestLayout = ({ children }: PropsWithChildren) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [pageLoaded, setPageLoaded] = useState(false);

    // Track scroll position for various effects
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Add page load animation
    useEffect(() => {
        setPageLoaded(true);
        window.scrollTo(0, 0);
    }, []);

    const showScrollTop = scrollPosition > 300;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            className={`
                flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100
                transition-all duration-500 overflow-hidden relative
                ${pageLoaded ? "opacity-100" : "opacity-0"}
            `}
        >
            {/* Skip to content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:m-4"
            >
                Skip to content
            </a>

            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Primary gradient orbs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

                {/* Secondary floating elements */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-300/20 to-yellow-300/20 rounded-full blur-2xl animate-bounce delay-500"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-l from-indigo-300/20 to-purple-300/20 rounded-full blur-xl animate-bounce delay-700"></div>

                {/* Geometric patterns */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-96 h-96 border border-white/10 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-8 border border-white/5 rounded-full animate-spin-reverse"></div>
                </div>
            </div>

            {/* Main Content */}
            <main
                id="main-content"
                className="flex-grow relative z-10 transition-all duration-500 ease-in-out"
            >
                {/* Page transition wrapper */}
                <div
                    className={`
                        transition-all duration-700 ease-out
                        ${
                            pageLoaded
                                ? "opacity-100 translate-y-0 scale-100"
                                : "opacity-0 translate-y-8 scale-95"
                        }
                    `}
                >
                    {children}
                </div>
            </main>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`
                    fixed bottom-8 right-8 p-4 rounded-full 
                    bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                    shadow-2xl hover:shadow-blue-500/25 hover:scale-110
                    transition-all duration-300 z-50 backdrop-blur-sm
                    border border-white/20
                    ${
                        showScrollTop
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
                    }
                `}
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-5 w-5" />
            </button>
        </div>
    );
};

export default GuestLayout;
