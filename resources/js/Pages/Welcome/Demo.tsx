import { useState } from "react";

const Demo = () => {
    const [activeTab, setActiveTab] = useState("environments");

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <span className="inline-block py-1 px-3 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full mb-4">
                        Interactive Demo
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Explore the Platform
                    </h2>
                    <p className="text-xl text-gray-600">
                        See how Environment Manager simplifies your workflow
                        with powerful management features
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 max-w-5xl mx-auto transform hover:shadow-2xl transition-all duration-300 relative">
                    {/* Decorative elements */}
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-50 rounded-full filter blur-3xl opacity-30 z-0"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-30 z-0"></div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 relative z-10 bg-gray-50">
                        {["environments", "roles", "users", "audit"].map(
                            (tab) => (
                                <button
                                    key={tab}
                                    className={`flex-grow py-4 px-6 text-sm font-medium transition-all duration-200 relative ${
                                        activeTab === tab
                                            ? "text-indigo-600 font-semibold"
                                            : "text-gray-600 hover:text-indigo-600"
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    {activeTab === tab && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
                                    )}
                                </button>
                            )
                        )}
                    </div>

                    {/* Tab Content */}
                    <div className="p-8 relative z-10">
                        {activeTab === "environments" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Environment Management
                                    </h3>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:translate-y-[-1px]">
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
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        Add New
                                    </button>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {[
                                                {
                                                    name: "API Gateway",
                                                    type: "Production",
                                                    status: "Active",
                                                },
                                                {
                                                    name: "Web Frontend",
                                                    type: "Staging",
                                                    status: "Testing",
                                                },
                                                {
                                                    name: "Mobile Backend",
                                                    type: "Development",
                                                    status: "Active",
                                                },
                                            ].map((env, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {env.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {env.type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${
                                                        env.status === "Active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                        >
                                                            {env.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button className="text-indigo-600 hover:text-indigo-800 mr-3 hover:underline">
                                                            Edit
                                                        </button>
                                                        <button className="text-gray-600 hover:text-gray-800 hover:underline">
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "roles" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Role Management
                                    </h3>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-all duration-200 flex items-center gap-2">
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
                                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                            />
                                        </svg>
                                        Filter
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            name: "Super Admin",
                                            description:
                                                "Full system access including deletion rights",
                                            count: 2,
                                            color: "indigo",
                                        },
                                        {
                                            name: "Programmer",
                                            description:
                                                "Full access to development and staging environments",
                                            count: 8,
                                            color: "blue",
                                        },
                                        {
                                            name: "Supervisor",
                                            description:
                                                "Full access to all environment types",
                                            count: 4,
                                            color: "purple",
                                        },
                                        {
                                            name: "Basic User",
                                            description:
                                                "View-only access to permitted environments",
                                            count: 12,
                                            color: "gray",
                                        },
                                    ].map((role, i) => (
                                        <div
                                            key={i}
                                            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:border-indigo-100"
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-3 h-3 rounded-full bg-${role.color}-500 mr-2`}
                                                    ></div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        {role.name}
                                                    </h4>
                                                </div>
                                                <span className="text-sm bg-indigo-50 text-indigo-600 py-1 px-2 rounded">
                                                    {role.count} users
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {role.description}
                                            </p>
                                            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1 group">
                                                Edit Permissions
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-200"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "users" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        User Management
                                    </h3>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            className="pl-8 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Group
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {[
                                                {
                                                    name: "John Smith",
                                                    email: "john@example.com",
                                                    role: "Super Admin",
                                                    group: "Management",
                                                },
                                                {
                                                    name: "Sarah Johnson",
                                                    email: "sarah@example.com",
                                                    role: "Programmer",
                                                    group: "Development",
                                                },
                                                {
                                                    name: "Miguel Rodriguez",
                                                    email: "miguel@example.com",
                                                    role: "Supervisor",
                                                    group: "Operations",
                                                },
                                                {
                                                    name: "Emma Wilson",
                                                    email: "emma@example.com",
                                                    role: "Basic User",
                                                    group: "Marketing",
                                                },
                                            ].map((user, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold shadow-sm">
                                                                {user.name.charAt(
                                                                    0
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {user.group}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 inline-flex float-right">
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
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "audit" && (
                            <div className="space-y-5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Audit Logs
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                            Filter:
                                        </span>
                                        <select className="text-sm rounded-lg border border-gray-300 bg-white text-gray-700 py-2 px-3 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200">
                                            <option>All Actions</option>
                                            <option>Create</option>
                                            <option>Update</option>
                                            <option>Delete</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        {
                                            user: "John Smith",
                                            action: "Updated environment",
                                            target: "API Gateway",
                                            time: "10 minutes ago",
                                            type: "update",
                                        },
                                        {
                                            user: "Sarah Johnson",
                                            action: "Created new variable",
                                            target: "Web Frontend",
                                            time: "2 hours ago",
                                            type: "create",
                                        },
                                        {
                                            user: "Miguel Rodriguez",
                                            action: "Modified user role",
                                            target: "Emma Wilson",
                                            time: "Yesterday",
                                            type: "update",
                                        },
                                        {
                                            user: "John Smith",
                                            action: "Deleted variable",
                                            target: "Mobile Backend",
                                            time: "3 days ago",
                                            type: "delete",
                                        },
                                    ].map((log, i) => (
                                        <div
                                            key={i}
                                            className="bg-white rounded-lg p-4 border border-gray-100 flex items-center hover:shadow-md transition-all duration-200 hover:border-indigo-100"
                                        >
                                            <div
                                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-sm
                                        ${
                                            log.type === "create"
                                                ? "bg-green-100 text-green-600"
                                                : log.type === "update"
                                                ? "bg-blue-100 text-blue-600"
                                                : "bg-red-100 text-red-600"
                                        }`}
                                            >
                                                {log.type === "create" && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                        />
                                                    </svg>
                                                )}
                                                {log.type === "update" && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                        />
                                                    </svg>
                                                )}
                                                {log.type === "delete" && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {log.action}
                                                    </h4>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        {log.time}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {log.target}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3 w-3"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                    By {log.user}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Demo;
