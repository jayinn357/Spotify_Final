// resources/js/pages/auth/reset-password.tsx
import React, { FormEventHandler, useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, RotateCcw } from 'lucide-react';
import api from '@/lib/api';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

    useEffect(() => {
        document.title = 'Reset Password - SB19 MAHALIMA';
    }, []);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors(null);
        try {
            await api.auth.resetPassword({ email, password, token });
            setPassword('');
            setPasswordConfirmation('');
        } catch (err: any) {
            if (err && err.errors) {
                const map: Record<string, string[]> = {};
                for (const item of err.errors) {
                    const key = item.param || 'general';
                    map[key] = map[key] || [];
                    map[key].push(item.msg || item.message || 'Error');
                }
                setErrors(map);
            } else if (err && err.message) {
                setErrors({ general: [err.message] });
            } else {
                setErrors({ general: ['Request failed'] });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-yellow-400/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-yellow-400/3 rounded-full blur-3xl"></div>
                </div>

                <div className="relative w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="mx-auto h-20 w-20 rounded-full overflow-hidden mb-4 ring-4 ring-yellow-400/20">
                            <img src="/images/system_logo2.png" alt="MAHALIMA Logo" className="h-full w-full object-cover" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                        <p className="text-gray-400">Create a new password for your account</p>
                    </div>

                    <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input id="email" type="email" value={email} className="w-full px-4 py-3 bg-gray-800/30 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed" readOnly />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 ${errors?.password ? 'border-red-500' : 'border-gray-600'}`} placeholder="Enter new password" required autoComplete="new-password" />
                                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors?.password && (<p className="mt-2 text-sm text-red-400">{errors.password.join(' ')}</p>)}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input id="password_confirmation" type={showPasswordConfirmation ? 'text' : 'password'} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 ${errors?.password_confirmation ? 'border-red-500' : 'border-gray-600'}`} placeholder="Confirm new password" required autoComplete="new-password" />
                                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition" onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}>
                                        {showPasswordConfirmation ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors?.password_confirmation && (<p className="mt-2 text-sm text-red-400">{errors.password_confirmation.join(' ')}</p>)}
                            </div>

                            <button type="submit" disabled={processing} className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                                        Resetting password...
                                    </>
                                ) : (
                                    <>
                                        <RotateCcw className="w-5 h-5 mr-2" />
                                        Reset Password
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <p className="text-center text-sm text-gray-400">Your new password should be different from your previous password</p>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-500 text-sm">© 2024 SB19 MAHALIMA. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </>
    );
}