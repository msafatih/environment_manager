"use client";

import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";

interface NavItem {
    name: string;
    href: string;
    icon: JSX.Element;
}

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeItem, setActiveItem] = useState("/");
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const { url, props } = usePage();

    // Check if user is authenticated
    const isAuthenticated = props.auth?.user;

    // Handle scroll event to change navbar appearance
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        // Close mobile menu on resize to desktop
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target as Node)
            ) {
                setShowUserDropdown(false);
            }
        };

        // Scroll lock for mobile menu
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    // Set active item based on current path
    useEffect(() => {
        setActiveItem(url);
    }, [url]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown);
    };

    const navItems: NavItem[] = [
        {
            name: "Features",
            href: "/features",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                </svg>
            ),
        },
        {
            name: "Documentation",
            href: "/docs",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
        },
    ];

    // Dashboard items for authenticated users
    const dashboardItems: NavItem[] = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
        },
        {
            name: "Projects",
            href: "/projects",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <>
            {/* Overlay for mobile menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                ></div>
            )}

            <nav
                className={`fixed top-0 left-0 right-0 w-full transition-all duration-300 z-50 
          ${
              isScrolled
                  ? "bg-white text-gray-800 shadow-lg py-2"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 md:py-4"
          }`}
            >
                <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
                    {/* Logo & Brand */}
                    <div className="flex items-center space-x-3 group">
                        <div
                            className={`mr-2 transition-colors duration-300 ${
                                isScrolled ? "text-indigo-600" : "text-white"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 transform group-hover:rotate-12 transition-transform duration-300"
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
                        <Link
                            href="/"
                            className={`text-xl font-bold tracking-tight transition-colors duration-300 hidden sm:block
                ${
                    isScrolled
                        ? "text-gray-800 hover:text-indigo-600"
                        : "text-white hover:text-blue-100"
                }`}
                        >
                            Environment Manager
                        </Link>
                        <Link
                            href="/"
                            className={`text-xl font-bold tracking-tight transition-colors duration-300 sm:hidden
                ${
                    isScrolled
                        ? "text-gray-800 hover:text-indigo-600"
                        : "text-white hover:text-blue-100"
                }`}
                        >
                            EM
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {/* Regular Nav Items */}
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                  ${
                      activeItem === item.href
                          ? isScrolled
                              ? "text-indigo-600 bg-indigo-50"
                              : "text-white bg-white/20"
                          : isScrolled
                          ? "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}

                        {/* Dashboard items for authenticated users */}
                        {isAuthenticated &&
                            dashboardItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                  ${
                      activeItem === item.href
                          ? isScrolled
                              ? "text-indigo-600 bg-indigo-50"
                              : "text-white bg-white/20"
                          : isScrolled
                          ? "text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}

                        <div className="h-6 mx-2 border-r border-gray-300 opacity-30"></div>

                        {/* Authentication Links */}
                        {isAuthenticated ? (
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    onClick={toggleUserDropdown}
                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                        isScrolled
                            ? "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                            : "text-white hover:bg-white/10"
                    }`}
                                >
                                    <span className="mr-1">
                                        {props.auth.user.full_name}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {/* User Dropdown */}
                                {showUserDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Your Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Settings
                                        </Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                    ${
                        isScrolled
                            ? "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                            : "text-white hover:bg-white/10"
                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center
                    ${
                        isScrolled
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                            : "bg-white text-indigo-600 hover:bg-blue-50"
                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                        />
                                    </svg>
                                    Sign up free
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`lg:hidden focus:outline-none transition-colors duration-300
              ${isScrolled ? "text-gray-800" : "text-white"}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation Menu - Slide from right */}
                <div
                    className={`lg:hidden fixed top-0 bottom-0 right-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out h-full overflow-y-auto ${
                        isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div className="font-bold text-lg text-indigo-600">
                            Menu
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-400 hover:text-gray-500"
                            aria-label="Close menu"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Mobile User Profile Section (if authenticated) */}
                    {isAuthenticated && (
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div>
                                    <div className="font-medium text-gray-900">
                                        {props.auth.user.full_name}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">
                                        {props.auth.user.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="py-4 px-6">
                        <div className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2">
                            Navigation
                        </div>
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center py-3 px-4 rounded-lg transition duration-200
                    ${
                        activeItem === item.href
                            ? "bg-indigo-50 text-indigo-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}

                            {/* Dashboard items for authenticated users */}
                            {isAuthenticated && (
                                <>
                                    <div className="text-xs uppercase text-gray-500 font-semibold tracking-wider mt-6 mb-2">
                                        Dashboard
                                    </div>
                                    {dashboardItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center py-3 px-4 rounded-lg transition duration-200
                        ${
                            activeItem === item.href
                                ? "bg-indigo-50 text-indigo-600 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                        }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.icon}
                                            {item.name}
                                        </Link>
                                    ))}
                                    <Link
                                        href="/profile"
                                        className="flex items-center py-3 px-4 rounded-lg transition duration-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Your Profile
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Authentication Links for Mobile */}
                        {!isAuthenticated ? (
                            <div className="border-t border-gray-100 my-6 pt-6">
                                <div className="space-y-3">
                                    <Link
                                        href="/login"
                                        className="flex items-center w-full py-3 px-4 rounded-lg font-medium transition duration-200 border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2 text-gray-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center w-full py-3 px-4 rounded-lg font-medium transition duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm"
                                        onClick={() => setIsMenuOpen(false)}
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
                                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                            />
                                        </svg>
                                        Sign up free
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="border-t border-gray-100 my-6 pt-6">
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex items-center w-full py-3 px-4 rounded-lg font-medium transition duration-200 text-red-600 hover:bg-red-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogOut className="h-5 w-5 mr-2" />
                                    Sign out
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Social Links in Mobile Menu */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Twitter</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">GitHub</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">LinkedIn</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
