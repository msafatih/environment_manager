import { Link } from "@inertiajs/react";
import { useState } from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Add subscription logic here
        alert(`Thanks for subscribing with ${email}!`);
        setEmail("");
    };

    return (
        <footer className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 text-white w-full pt-16 pb-10 px-6 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <pattern
                            id="grid"
                            width="10"
                            height="10"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 10 0 L 0 0 0 10"
                                fill="none"
                                stroke="white"
                                strokeWidth="0.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="container mx-auto relative z-10">
                {/* Top Section with Subscribe */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-12 shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                Stay Updated
                            </h2>
                            <p className="text-white/80">
                                Get the latest news, features, and updates from
                                Environment Manager.
                            </p>
                        </div>
                        <form
                            onSubmit={handleSubscribe}
                            className="flex flex-col sm:flex-row gap-3"
                        >
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-grow px-4 py-3 rounded-lg bg-white/20 border border-white/30 
                                           text-white placeholder-white/50 focus:outline-none focus:ring-2 
                                           focus:ring-white/50 backdrop-blur-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg 
                                           transition duration-200 hover:bg-indigo-50 transform hover:scale-105"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Company Info */}
                    <div className="flex flex-col space-y-5">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center rounded-md bg-white/10 p-2">
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
                                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                Environment Manager
                            </span>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Simplify your development workflow with our powerful
                            environment management platform. Focus on code, not
                            infrastructure.
                        </p>
                        <div className="flex space-x-4 mt-2">
                            <a
                                href="#"
                                className="text-white/60 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                                aria-label="Twitter"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-white/60 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                                aria-label="GitHub"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-white/60 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                                aria-label="LinkedIn"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-lg font-semibold mb-2 relative">
                            <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full"></span>
                            Product
                        </h3>
                        <Link
                            href="/features"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>Features</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 opacity-0 group-hover:opacity-100"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>Pricing</span>
                        </Link>
                        <Link
                            href="/changelog"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>Changelog</span>
                        </Link>
                        <Link
                            href="/roadmap"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>Roadmap</span>
                        </Link>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-lg font-semibold mb-2 relative">
                            <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></span>
                            Resources
                        </h3>
                        <Link
                            href="/docs"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>Documentation</span>
                        </Link>
                        <Link
                            href="/blog"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>Blog</span>
                        </Link>
                        <Link
                            href="/guides"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>Guides</span>
                        </Link>
                        <Link
                            href="/api"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>API Reference</span>
                        </Link>
                    </div>

                    {/* Company */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="text-lg font-semibold mb-2 relative">
                            <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full"></span>
                            Company
                        </h3>
                        <Link
                            href="/about"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>About Us</span>
                        </Link>
                        <Link
                            href="/contact"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>Contact</span>
                        </Link>
                        <Link
                            href="/careers"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>Careers</span>
                        </Link>
                        <Link
                            href="/press"
                            className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform flex items-center gap-1"
                        >
                            <span>Press</span>
                        </Link>
                    </div>
                </div>

                {/* Bottom Section with Legal */}
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-white/60 text-sm">
                        &copy; {currentYear} Environment Manager. All rights
                        reserved.
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
                        <Link
                            href="/privacy"
                            className="text-white/60 hover:text-white transition-colors duration-200"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-white/60 hover:text-white transition-colors duration-200"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/cookies"
                            className="text-white/60 hover:text-white transition-colors duration-200"
                        >
                            Cookie Policy
                        </Link>
                        <Link
                            href="/security"
                            className="text-white/60 hover:text-white transition-colors duration-200"
                        >
                            Security
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
