// resources/js/pages/auth/forgot-password.tsx
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const [email, setEmail] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
    const [success, setSuccess] = useState(false);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await api.auth.forgotPassword(email);
            setSuccess(true);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errors' in error) {
                setErrors(error.errors as { email?: string; message?: string });
            } else if (error && typeof error === 'object' && 'message' in error) {
                setErrors({ message: error.message as string });
            } else {
                setErrors({ message: 'Failed to send reset link.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
                {/* Background Pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-yellow-400/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-yellow-400/3 rounded-full blur-3xl"></div>
                </div>

                <div className="relative w-full max-w-md">
                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-20 w-20 rounded-full overflow-hidden mb-4 ring-4 ring-yellow-400/20">
                            <img 
                                src="/images/system_logo2.png" 
                                alt="MAHALIMA Logo" 
                                className="h-full w-full object-cover" 
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
                        <p className="text-gray-400">Enter your email to receive a password reset link</p>
                    </div>

                    {/* Status Message */}
                    {(status || success) && (
                        <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                            <p className="text-green-400 text-sm text-center">
                                {success ? 'Password reset link sent! Check your email.' : status}
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {errors.message && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 text-sm text-center">{errors.message}</p>
                        </div>
                    )}

                    {/* Forgot Password Form */}
                    <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 ${
                                            errors.email ? 'border-red-500' : 'border-gray-600'
                                        }`}
                                        placeholder="Enter your email address"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="username"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                                        Sending link...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Reset Link
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Additional Links */}
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center text-sm text-yellow-400 hover:text-yellow-300 transition"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back to login
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-gray-500 text-sm">
                            © 2024 SB19 MAHALIMA. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}