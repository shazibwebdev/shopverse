import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('')

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(`/api/auth/verify-email/${token}`)
                setMessage(res.data.msg)
                setStatus('success')
            } catch (err) {
                setMessage(err.response?.data?.msg || 'Verification failed.')
                setStatus('error')
            }
        }
        verify()
    }, [token])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center"
            >
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Verifying your email...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified</h2>
                        <p className="text-gray-500 mb-6">{message}</p>
                        <Link to="/auth">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                            >
                                Go to Login
                            </motion.button>
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                        <p className="text-gray-500 mb-6">{message}</p>
                        <Link to="/auth">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition"
                            >
                                Back to Login
                            </motion.button>
                        </Link>
                    </>
                )}
            </motion.div>
        </div>
    )
}

export default VerifyEmail
