// resources/js/pages/auth/verify-email.tsx
import { FormEventHandler, useEffect, useState } from 'react';
import { Mail, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const [processing, setProcessing] = useState(false);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Email Verification - SB19 MAHALIMA';
    }, []);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setInfoMessage(null);
        try {
            await api.post('/auth/email/verification-notification');
            setInfoMessage('Verification email sent.');
        } catch (err: any) {
            setInfoMessage(err?.message || 'Failed to send verification email');
        } finally {
            setProcessing(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.auth.logout();
            window.location.href = '/';
        } catch (_) {
            window.location.href = '/';
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
                        <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
                        <p className="text-gray-400">Please check your email for a verification link</p>
                    </div>

                    {/* Status Message */}
                    {status === 'verification-link-sent' && (
                        <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <p className="text-green-400 text-sm">
                                    A new verification link has been sent to your email address.
                                </p>
                            </div>
                        </div>
                    )}

                    {infoMessage && (
                        <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                                <p className="text-green-400 text-sm">{infoMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Email Verification Form */}
                    <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
                        <div className="text-center mb-6">
                            <Mail className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                            <p className="text-gray-300 text-sm leading-relaxed">
                                We've sent a verification link to your email address. 
                                Please click the link in the email to verify your account.
                            </p>
                        </div>

                        <form onSubmit={submit}>
                            <button type="submit" disabled={processing} className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                {processing ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>Sending...</>) : (<><Send className="w-5 h-5 mr-2" />Resend Verification Email</>)}
                            </button>
                        </form>

                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <div className="text-center space-y-3">
                                <p className="text-gray-400 text-sm">
                                    Didn't receive the email? Check your spam folder or click the button above to resend.
                                </p>
                                <button onClick={handleLogout} type="button" className="inline-flex items-center text-sm text-yellow-400 hover:text-yellow-300 transition">
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Sign out
                                </button>
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