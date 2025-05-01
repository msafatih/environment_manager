import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
    Menu,
    Search,
    User,
    ChevronDown,
    Settings,
    LogOut,
    UserCircle,
    HelpCircle,
} from "lucide-react";
import { useState, useRef } from "react";

interface HeaderProps {
    toggleSidebar: () => void;
    toggleUserDropdown: () => void;
    userDropdownOpen: boolean;
}

const Header = ({
    toggleSidebar,
    toggleUserDropdown,
    userDropdownOpen,
}: HeaderProps) => {
    const { auth } = usePage<PageProps>().props;
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    const handleSearchFocus = () => {
        setSearchFocused(true);
    };

    const handleSearchBlur = () => {
        setSearchFocused(false);
    };

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between px-4 shadow-sm border-b border-gray-200 bg-white text-gray-800 sm:px-6">
            <div className="md:hidden flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="rounded-md p-2 transition-colors duration-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            {/* Search */}
            <div
                className={`relative max-w-md w-full mx-4 transition-all duration-300 ${
                    searchFocused ? "scale-105" : ""
                }`}
                ref={searchRef}
            >
                <div
                    className={`relative rounded-md shadow-sm ${
                        searchFocused ? "ring-2 ring-indigo-500" : ""
                    }`}
                >
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search
                            className={`h-4 w-4 ${
                                searchFocused
                                    ? "text-indigo-500"
                                    : "text-gray-400"
                            }`}
                        />
                    </div>
                    <input
                        id="search"
                        name="search"
                        className="block w-full rounded-md py-2 pl-10 pr-3 text-sm 
                            bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 
                            focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Search projects, variables, or environments..."
                        type="search"
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                    />
                    {searchFocused && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                            Press / to focus
                        </div>
                    )}
                </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-1 sm:space-x-3">
                {/* Help */}
                <button
                    className="p-1.5 rounded-full transition-colors duration-200 hidden sm:block
                        text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Help"
                >
                    <HelpCircle className="h-5 w-5" />
                </button>

                {/* Profile dropdown */}
                <div className="relative" ref={userDropdownRef}>
                    <button
                        onClick={toggleUserDropdown}
                        className="flex items-center space-x-1 rounded-full p-1 text-sm focus:outline-none"
                        id="user-menu"
                        aria-expanded={userDropdownOpen}
                        aria-haspopup="true"
                    >
                        <div
                            className="relative flex h-8 w-8 items-center justify-center rounded-full overflow-hidden
                                bg-indigo-100 text-indigo-600"
                        >
                            {auth.user?.avatar ? (
                                <img
                                    src={auth.user.avatar || "/placeholder.svg"}
                                    alt={auth.user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User className="h-5 w-5" />
                            )}
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white"></span>
                        </div>
                        <div className="hidden md:flex md:items-center">
                            <span className="text-sm font-medium text-gray-700">
                                {auth.user?.name}
                            </span>
                            <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                        </div>
                    </button>

                    {/* Dropdown menu */}
                    {userDropdownOpen && (
                        <div
                            className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="user-menu"
                        >
                            <div className="border-b border-gray-100 px-4 py-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {auth.user?.name}
                                </p>
                                <p className="truncate text-xs text-gray-500">
                                    {auth.user?.email}
                                </p>
                            </div>

                            <div className="py-1">
                                <Link
                                    href="/profile"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-700"
                                    role="menuitem"
                                >
                                    <UserCircle className="mr-3 h-4 w-4" />
                                    Your Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-700"
                                    role="menuitem"
                                >
                                    <Settings className="mr-3 h-4 w-4" />
                                    Settings
                                </Link>
                            </div>

                            <div className="border-t border-gray-100 py-1">
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                                    role="menuitem"
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    Sign out
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
