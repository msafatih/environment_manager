import { Link } from "@inertiajs/react";

const RoleBased = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 opacity-50"></div>
            <div className="absolute -left-32 bottom-0 w-64 h-64 bg-indigo-50 rounded-full filter blur-3xl opacity-70"></div>
            <div className="absolute -right-32 top-32 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-70"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="inline-block py-1 px-3 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-4">
                        Flexible Permissions
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Tailored Access Levels
                    </h2>
                    <p className="text-xl text-gray-600">
                        Assign the right permissions to the right people with
                        our customizable role system that scales with your
                        organization
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Role Card 1 - Super Admin */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5 relative">
                            <div className="absolute top-0 right-0 mt-3 mr-3 bg-white bg-opacity-20 rounded-full p-1.5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                Super Admin
                            </h3>
                            <p className="text-indigo-100 text-sm mt-1">
                                Full system control
                            </p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-4">
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    Manage environment types
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    Full role management
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    Global access control
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    Environment deletion rights
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-500">
                                    Recommended for organization administrators
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Role Card 2 - Programmer */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 relative">
                            <div className="absolute top-0 right-0 mt-3 mr-3 bg-white bg-opacity-20 rounded-full p-1.5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                Programmer
                            </h3>
                            <p className="text-blue-100 text-sm mt-1">
                                Development focused
                            </p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-4">
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    Create/edit in development
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    Create/edit in staging
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    View production environments
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3 text-red-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </div>
                                    No deletion rights
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-500">
                                    Recommended for development team members
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Role Card 3 - Basic User */}
                    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1">
                        <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-5 relative">
                            <div className="absolute top-0 right-0 mt-3 mr-3 bg-white bg-opacity-20 rounded-full p-1.5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                Basic User
                            </h3>
                            <p className="text-gray-200 text-sm mt-1">
                                View-only access
                            </p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-4">
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    View permitted environments
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    View environment variables
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3 text-red-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </div>
                                    No edit access
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3 text-red-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </div>
                                    No deletion rights
                                </li>
                            </ul>
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <span className="text-xs text-gray-500">
                                    Recommended for stakeholders and reporting
                                    staff
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/roles"
                        className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 group"
                    >
                        Learn more about role customization
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
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
                </div>
            </div>
        </section>
    );
};

export default RoleBased;
