import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { PropsWithChildren, useEffect, useState } from "react";

const GuestLayout = ({ children }: PropsWithChildren) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [pageLoaded, setPageLoaded] = useState(false);

    // Track scroll position for various effects
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Add page load animation
    useEffect(() => {
        setPageLoaded(true);

        // Optional: You can add scroll restoration here
        window.scrollTo(0, 0);
    }, []);

    // Scroll to top button visibility
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
            flex min-h-screen flex-col bg-white  
            transition-colors duration-300 overflow-hidden
            ${pageLoaded ? "opacity-100" : "opacity-0"}
        `}
        >
            {/* Skip to content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white"
            >
                Skip to content
            </a>

            {/* Fixed Background Elements (optional decorative elements) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
            </div>

            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main
                id="main-content"
                className={`
                    flex-grow container mx-auto pt-8 md:pt-12 
                    relative z-10 transition-all duration-500 ease-in-out
                    ${scrollPosition > 50 ? "pt-24" : "pt-20"}
                `}
            >
                {/* Page transition wrapper */}
                <div
                    className={`
                    transition-opacity duration-500 ease-in-out
                    ${
                        pageLoaded
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
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
                    fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white 
                    shadow-lg hover:bg-indigo-700 transition-all duration-300 z-40
                    ${
                        showScrollTop
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-90 pointer-events-none"
                    }
                `}
                aria-label="Scroll to top"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            <Footer />
        </div>
    );
};

export default GuestLayout;
