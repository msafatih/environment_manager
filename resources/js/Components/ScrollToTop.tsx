import { useEffect, useState } from "react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 500);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top handler
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 z-30 ${
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5 pointer-events-none"
            }`}
            aria-label="Scroll to top"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
            </svg>
        </button>
    );
};

export default ScrollToTop;
