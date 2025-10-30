import { FormEvent, useState } from 'react';
import { User, Mail, Trash2, UserCircle, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // Profile form state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [success, setSuccess] = useState(false);

    // Delete account form state
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [deleteErrors, setDeleteErrors] = useState<{ password?: string; message?: string }>({});

    const submitProfile = async (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccess(false);

        try {
            await api.settings.updateProfile({ name, email });
            await refreshUser();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errors' in error) {
                setErrors(error.errors as { name?: string; email?: string; message?: string });
            } else if (error && typeof error === 'object' && 'message' in error) {
                setErrors({ message: error.message as string });
            } else {
                setErrors({ message: 'Failed to update profile.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    const submitDelete = async (e: FormEvent) => {
        e.preventDefault();
        setDeleteProcessing(true);
        setDeleteErrors({});

        try {
            await api.settings.deleteAccount({ password: deletePassword });
            // User will be logged out and redirected by the server
            window.location.href = '/';
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errors' in error) {
                setDeleteErrors(error.errors as { password?: string; message?: string });
            } else if (error && typeof error === 'object' && 'message' in error) {
                setDeleteErrors({ message: error.message as string });
            } else {
                setDeleteErrors({ message: 'Failed to delete account.' });
            }
            setDeleteProcessing(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
                {/* Background Pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-yellow-400/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-yellow-400/3 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-20 w-20 rounded-full overflow-hidden mb-4 ring-4 ring-yellow-400/20">
                            <img 
                                src="/images/system_logo2.png" 
                                alt="MAHALIMA Logo" 
                                className="h-full w-full object-cover" 
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                        <p className="text-gray-400">Manage your account information and preferences</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                        {/* Profile Information Section */}
                        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
                            <div className="flex items-center mb-6">
                                <UserCircle className="w-8 h-8 text-yellow-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                            </div>

                            {success && (
                                <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <p className="text-green-400 text-sm">Profile updated successfully!</p>
                                </div>
                            )}

                            {errors.message && (
                                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-red-400 text-sm">{errors.message}</p>
                                </div>
                            )}

                            <form onSubmit={submitProfile} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 ${
                                                errors.name ? 'border-red-500' : 'border-gray-600'
                                            }`}
                                            placeholder="Your full name"
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            autoComplete="name"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email
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
                                            placeholder="your.email@example.com"
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                {/* Email Verification Notice */}
                                {user.email_verified_at === null && (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                        <p className="text-yellow-400 text-sm">
                                            Your email address is unverified. Check your email for a verification link.
                                        </p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Delete Account Section */}
                        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-red-500/20 p-8 shadow-2xl">
                            <div className="flex items-center mb-6">
                                <Trash2 className="w-8 h-8 text-red-400 mr-3" />
                                <h2 className="text-2xl font-bold text-white">Delete Account</h2>
                            </div>

                            <div className="text-gray-300 text-sm leading-relaxed mb-6">
                                <p className="mb-4">
                                    Once your account is deleted, all of its resources and data will be permanently deleted. 
                                    Before deleting your account, please download any data or information that you wish to retain.
                                </p>
                            </div>

                            {!showDeleteConfirm ? (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                                >
                                    <Trash2 className="w-5 h-5 mr-2" />
                                    Delete Account
                                </button>
                            ) : (
                                <form onSubmit={submitDelete} className="space-y-6">
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <p className="text-red-400 text-sm mb-4">
                                            Are you sure you want to delete your account? This action cannot be undone.
                                        </p>
                                        
                                        <label htmlFor="delete_password" className="block text-sm font-medium text-gray-300 mb-2">
                                            Please enter your password to confirm:
                                        </label>
                                        <input
                                            id="delete_password"
                                            type="password"
                                            value={deletePassword}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-red-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200"
                                            placeholder="Your password"
                                            onChange={(e) => setDeletePassword(e.target.value)}
                                            required
                                        />
                                        {deleteErrors.password && (
                                            <p className="mt-2 text-sm text-red-400">{deleteErrors.password}</p>
                                        )}
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowDeleteConfirm(false);
                                                setDeletePassword('');
                                                setDeleteErrors({});
                                            }}
                                            className="flex-1 px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={deleteProcessing}
                                            className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {deleteProcessing ? 'Deleting...' : 'Delete Account'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Back to Dashboard Link */}
                    <div className="text-center mt-8">
                        <a 
                            href="/" 
                            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition"
                        >
                            ← Back to Dashboard
                        </a>
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