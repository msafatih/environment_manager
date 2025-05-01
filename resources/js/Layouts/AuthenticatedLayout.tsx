"use client";

import {
    type PropsWithChildren,
    type ReactNode,
    useState,
    useEffect,
    useRef,
} from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import Header from "@/Components/Header";

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    header?: ReactNode;
    fluid?: boolean; // Option for full-width content
}

const AuthenticatedLayout = ({
    children,
    fluid = false,
}: AuthenticatedLayoutProps) => {
    const { props } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            // On first load for desktop, start with open sidebar
            if (!mobile && !pageLoaded) {
                setSidebarOpen(true);
            }
        };

        // Detect initial screen size
        handleResize();
        setPageLoaded(true);

        // Add resize listener
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, [pageLoaded]);

    // Click outside handling for user dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target as Node)
            ) {
                setUserDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll to top when changing pages
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
    }, [props.url]); // Reset scroll when URL changes

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleUserDropdown = () => {
        setUserDropdownOpen(!userDropdownOpen);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Mobile sidebar backdrop with fade effect */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar component */}
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main content area with flexible layout */}
            <div
                className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
                    sidebarOpen ? "lg:ml-64" : ""
                }`}
                ref={userDropdownRef}
            >
                {/* Header component */}
                <Header
                    toggleSidebar={toggleSidebar}
                    toggleUserDropdown={toggleUserDropdown}
                    userDropdownOpen={userDropdownOpen}
                />

                {/* Page content wrapper - this is the scrollable container */}
                <div className="flex-1 overflow-y-auto" ref={mainContentRef}>
                    {/* Main content area with appropriate padding and max-width */}
                    <main className="flex-1">
                        <div
                            className={`p-4 sm:p-6 lg:p-8 ${
                                fluid ? "w-full" : "max-w-7xl mx-auto"
                            }`}
                        >
                            <div className="animate-fadeIn">{children}</div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AuthenticatedLayout;
