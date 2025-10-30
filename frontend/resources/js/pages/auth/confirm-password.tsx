// resources/js/pages/auth/confirm-password.tsx
import React, { FormEventHandler, useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import api from '@/lib/api';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

    useEffect(() => {
        document.title = 'Confirm Password - SB19 MAHALIMA';
    }, []);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors(null);
        try {
            await api.auth.confirmPassword(password);
            setPassword('');
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
                        <h1 className="text-3xl font-bold text-white mb-2">Confirm Password</h1>
                        <p className="text-gray-400">Please confirm your password to continue</p>
                    </div>

                    <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
                        <div className="text-center mb-6">
                            <Shield className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                            <p className="text-gray-300 text-sm leading-relaxed">This is a secure area of the application. Please confirm your password before continuing.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 ${errors?.password ? 'border-red-500' : 'border-gray-600'}`} placeholder="Enter your password" required autoComplete="current-password" autoFocus />
                                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors?.password && (<p className="mt-2 text-sm text-red-400">{errors.password.join(' ')}</p>)}
                            </div>

                            <button type="submit" disabled={processing} className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                {processing ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>Confirming...</>) : (<><Shield className="w-5 h-5 mr-2" />Confirm</>)}
                            </button>
                        </form>
                    </div>

                    <div className="text-center mt-6"><p className="text-gray-500 text-sm">© 2024 SB19 MAHALIMA. All rights reserved.</p></div>
                </div>
            </div>
        </>
    );
}