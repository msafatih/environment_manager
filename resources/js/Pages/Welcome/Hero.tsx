import { Link } from "@inertiajs/react";

const Hero = () => {
    return (
        <section className="relative pt-24 pb-28 overflow-hidden bg-gradient-to-r from-indigo-50 to-blue-50">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-100 opacity-50"></div>
            <div className="absolute -left-16 top-20 w-64 h-64 bg-indigo-200 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>

            <div className="container relative mx-auto px-4 z-10">
                <div className="flex flex-wrap items-center -mx-4">
                    <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
                        <span className="inline-block py-1 px-3 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-4">
                            Environment Manager
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            Control your{" "}
                            <span className="text-indigo-600 relative">
                                environments
                                <svg
                                    className="absolute bottom-0 left-0 w-full h-3 -mb-1 text-indigo-200"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 300 12"
                                >
                                    <path
                                        d="M0,0 C150,12 150,12 300,0"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </span>{" "}
                            with confidence
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            A secure, centralized platform for managing
                            application environments across your organization
                            with enhanced visibility and control.
                        </p>
                        <div className="flex flex-wrap gap-5">
                            <Link
                                href="/register"
                                className="px-8 py-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition duration-200 shadow-lg hover:shadow-indigo-200 hover:shadow-md hover:translate-y-[-2px]"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/login"
                                className="px-8 py-4 text-indigo-600 border border-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition duration-200 hover:shadow-md hover:translate-y-[-2px]"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 px-4">
                        <div className="relative mx-auto max-w-md">
                            {/* Background decorative elements */}
                            <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-100 rounded-full filter blur-xl opacity-70"></div>
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-100 rounded-full filter blur-xl opacity-70"></div>

                            {/* Dashboard mockup */}
                            <div className="relative z-10 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-indigo-600 p-3">
                                    <div className="flex items-center">
                                        <div className="flex space-x-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="ml-3 text-white text-sm font-medium">
                                            Environment Dashboard
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold">
                                            Environments
                                        </h3>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            4 Active
                                        </span>
                                    </div>
                                    {/* Environment cards */}
                                    <div className="space-y-4">
                                        {[
                                            {
                                                name: "Production API",
                                                type: "Production",
                                                status: "Active",
                                            },
                                            {
                                                name: "Staging Web",
                                                type: "Staging",
                                                status: "Testing",
                                            },
                                            {
                                                name: "Dev Server",
                                                type: "Development",
                                                status: "Active",
                                            },
                                        ].map((env, index) => (
                                            <div
                                                key={index}
                                                className="p-4 border border-gray-100 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow duration-200"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {env.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {env.type}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        env.status === "Active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {env.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
