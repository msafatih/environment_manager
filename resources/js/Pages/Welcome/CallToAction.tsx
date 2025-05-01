import { Link } from "@inertiajs/react";

const CallToAction = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-indigo-800 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>

            {/* Animated dots */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-0 top-0 w-full h-full opacity-10">
                    <div className="h-4 w-4 bg-white rounded-full absolute top-20 left-[10%] animate-pulse"></div>
                    <div
                        className="h-3 w-3 bg-white rounded-full absolute top-36 left-[25%] animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                    ></div>
                    <div
                        className="h-2 w-2 bg-white rounded-full absolute top-12 left-[40%] animate-pulse"
                        style={{ animationDelay: "0.7s" }}
                    ></div>
                    <div
                        className="h-3 w-3 bg-white rounded-full absolute top-28 left-[60%] animate-pulse"
                        style={{ animationDelay: "1.1s" }}
                    ></div>
                    <div
                        className="h-4 w-4 bg-white rounded-full absolute top-10 left-[80%] animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                    ></div>
                    <div
                        className="h-3 w-3 bg-white rounded-full absolute bottom-20 left-[15%] animate-pulse"
                        style={{ animationDelay: "0.8s" }}
                    ></div>
                    <div
                        className="h-2 w-2 bg-white rounded-full absolute bottom-36 left-[35%] animate-pulse"
                        style={{ animationDelay: "1.2s" }}
                    ></div>
                    <div
                        className="h-4 w-4 bg-white rounded-full absolute bottom-12 left-[55%] animate-pulse"
                        style={{ animationDelay: "0.9s" }}
                    ></div>
                    <div
                        className="h-3 w-3 bg-white rounded-full absolute bottom-28 left-[75%] animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                    ></div>
                </div>
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Ready to take{" "}
                        <span className="relative inline-block">
                            control
                            <svg
                                className="absolute -bottom-2 left-0 w-full h-3 text-white opacity-20"
                                preserveAspectRatio="none"
                                viewBox="0 0 300 12"
                            >
                                <path
                                    d="M0,0 C150,12 150,12 300,0"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </span>{" "}
                        of your environments?
                    </h2>

                    <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Start managing your application environments securely
                        and efficiently today with our comprehensive platform.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-medium shadow-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center min-w-[180px]"
                        >
                            <span>Get Started Now</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </Link>

                        <Link
                            href="/contact"
                            className="px-8 py-4 text-white border-2 border-white rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center min-w-[180px]"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <span>Contact Sales</span>
                        </Link>
                    </div>

                    <div className="mt-10 text-indigo-200 text-sm">
                        <p>
                            No credit card required. Free 14-day trial for new
                            accounts.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
