import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const validate = () => {
        if (!password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return false;
        }
        if (password.length < 8 || password.length > 15) {
            toast.error('Password must be between 8 and 15 characters');
            return false;
        }
        if (confirmPassword.length < 8 || confirmPassword.length > 15) {
            toast.error('Confirm password must be between 8 and 15 characters');
            return false;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await api.post(`/api/password/reset/${token}`, { password });
            toast.success(res.data.msg || 'Password reset successful');
            setTimeout(() => navigate('/auth'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h flex items-center justify-center bg-[var(--color-bg)] p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-text-primary)] font-poppins">
                    Reset Password
                </h2>

                <form onSubmit={handleReset} className="space-y-5">
                    {/* New Password */}
                    <div className="flex flex-col gap-1">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New Password (8–15 characters)"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-4 py-3 pr-10 transition-all duration-300 focus:border-[var(--color-primary)]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-3.5 right-3 text-[var(--color-text-secondary)] cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {password && (password.length < 8 || password.length > 15) && (
                            <p className="text-red-500 text-xs">Must be 8–15 characters</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1">
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Confirm Password (8–15 characters)"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-4 py-3 pr-10 transition-all duration-300 focus:border-[var(--color-primary)]"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute top-3.5 right-3 text-[var(--color-text-secondary)] cursor-pointer"
                            >
                                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {confirmPassword && confirmPassword !== password && (
                            <p className="text-red-500 text-xs">Passwords do not match</p>
                        )}
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        disabled={loading}
                        type="submit"
                        className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </motion.button>
                </form>

                <p className="text-sm text-center text-[var(--color-text-secondary)] mt-6">
                    <Link to={'/auth'} className="text-[var(--color-error)] hover:underline">
                        Back to Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
