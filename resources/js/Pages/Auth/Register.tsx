"use client";

import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { type FormEventHandler, useEffect, useState } from "react";
import {
    CheckCircle,
    EyeIcon,
    EyeOffIcon,
    Loader2,
    LockIcon,
    MailIcon,
    UserIcon,
} from "lucide-react";

declare var route: (name: string, params?: any) => string;

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordMessage, setPasswordMessage] = useState("");

    useEffect(() => {
        // Simulate loading for smoother transition
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Password strength checker
    useEffect(() => {
        if (!data.password) {
            setPasswordStrength(0);
            setPasswordMessage("");
            return;
        }

        // Check password strength
        let strength = 0;
        let message = "";

        // Length check
        if (data.password.length >= 8) strength += 1;

        // Contains lowercase
        if (/[a-z]/.test(data.password)) strength += 1;

        // Contains uppercase
        if (/[A-Z]/.test(data.password)) strength += 1;

        // Contains number
        if (/[0-9]/.test(data.password)) strength += 1;

        // Contains special char
        if (/[^A-Za-z0-9]/.test(data.password)) strength += 1;

        // Set message based on strength
        if (strength <= 2) {
            message = "Weak password";
        } else if (strength <= 4) {
            message = "Good password";
        } else {
            message = "Strong password";
        }

        setPasswordStrength(strength);
        setPasswordMessage(message);
    }, [data.password]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Create Account" />

            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div
                    className={`max-w-md w-full space-y-8 transition-all duration-700 ease-in-out ${
                        isLoading
                            ? "opacity-0 translate-y-4"
                            : "opacity-100 translate-y-0"
                    }`}
                >
                    {/* Logo and Header */}
                    <div className="text-center">
                        <div className="mx-auto h-14 w-14 relative">
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-white"
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
                            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-500 opacity-30 blur-sm animate-pulse"></div>
                        </div>
                        <h2 className="mt-8 text-3xl font-extrabold text-gray-900 tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-3 text-base text-gray-600">
                            Join Environment Manager to start managing your
                            application configurations
                        </p>
                    </div>

                    {/* Registration Form */}
                    <div className="mt-10 bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-gray-100">
                        <form className="space-y-6" onSubmit={submit}>
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Full name
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        className={`pl-10 block w-full border h-12 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 ${
                                            errors.name
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="John Smith"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email address
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MailIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`pl-10 block w-full border h-12 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 ${
                                            errors.email
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="name@company.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        className={`pl-10 block w-full border h-12 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 ${
                                            errors.password
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Password Strength Indicator */}
                                {data.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center mt-1">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        passwordStrength <= 2
                                                            ? "bg-red-500"
                                                            : passwordStrength <=
                                                              4
                                                            ? "bg-yellow-500"
                                                            : "bg-green-500"
                                                    }`}
                                                    style={{
                                                        width: `${
                                                            passwordStrength *
                                                            20
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span
                                                className={`ml-2 text-xs font-medium ${
                                                    passwordStrength <= 2
                                                        ? "text-red-500"
                                                        : passwordStrength <= 4
                                                        ? "text-yellow-500"
                                                        : "text-green-500"
                                                }`}
                                            >
                                                {passwordMessage}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Use 8+ characters with a mix of
                                            letters, numbers & symbols
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Password Confirmation Input */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Confirm password
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CheckCircle className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        required
                                        className={`pl-10 block w-full border h-12 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 ${
                                            errors.password_confirmation
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start mt-6">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        checked={data.terms}
                                        onChange={(e) =>
                                            setData("terms", e.target.checked)
                                        }
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="terms"
                                        className="text-gray-600"
                                    >
                                        I agree to the{" "}
                                        <a
                                            href="#"
                                            className="font-medium text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
                                        >
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a
                                            href="#"
                                            className="font-medium text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
                                        >
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 relative overflow-hidden h-12"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        "Create account"
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Login link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    href={route("login")}
                                    className="font-medium text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Alternative sign ups */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 py-1 bg-white text-gray-500 rounded-full border border-gray-200 shadow-sm">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 h-12"
                            >
                                <svg
                                    role="img"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 mr-2"
                                    fill="#181717"
                                >
                                    <title>GitHub</title>
                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                </svg>
                                GitHub
                            </button>
                            <button
                                type="button"
                                className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 h-12"
                            >
                                <svg
                                    className="h-5 w-5 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 488 512"
                                    fill="#4285F4"
                                >
                                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                                </svg>
                                Google
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-xs text-gray-500">
                        <p>
                            By creating an account, you agree to our{" "}
                            <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
                            >
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
                            >
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
