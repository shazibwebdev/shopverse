import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Package,
    Clock,
    CheckCircle,
    ChevronRight,
    User,
    ShoppingBag,
    ArrowRight,
    CreditCard
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../common/Loader';
import { Link } from 'react-router-dom';





// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const AccountOverview = () => {
    const {
        currentUser
    } = useAuth()
    const [orders, setOrders] = useState([]);
    const [userData, setUserData] = useState(currentUser);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    // console.log(currentUser);

    const fetchUser = async () => {
        try {
            const res = await api.get('/api/user/single')
            console.log(res.data);
            setUserData(res.data?.user)

        } catch (error) {
            console.error(error);
        }
        finally {
            // setIsWaiting(false)
        }

    }

    useEffect(() => {
        fetchUser()
    }, [])



    const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length
    const deliveredOrders = orders.filter(order => order.orderStatus === 'delivered').length
    const totalAmoutSpent = orders.reduce((acc, order) => {
        if (order.isPaid == true) return acc + order.orderSummary.totalAmount
        return acc + 0
    }, 0)

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const res = await api.get(`/api/order/user-orders`)
            console.log(res.data);
            setOrders(res.data?.orders)
            setRecentOrders(res.data?.orders.slice(0, 3).reverse())

        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    // Format date function
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };



    return (
        <div className="w-full bg-gray-50 p-4 md:p-6 overflow-x-hidden w-full">
            <motion.div
                className="max-w-6xl mx-auto w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Welcome Header */}
                <motion.div
                    className="flex items-center justify-between gap-3 mb-6 sm:mb-8"
                    variants={itemVariants}
                >
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate">
                            Welcome, {userData.username} 👋
                        </h1>
                        <p className="text-sm text-gray-600">Here's your account overview</p>
                    </div>
                    {userData.avatar !== '' && (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative flex-shrink-0"
                        >
                            <img
                                src={userData.avatar}
                                alt="Profile"
                                className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-md"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </motion.div>
                    )}
                </motion.div>

                {loading ? (
                    <div className='w-full h-[300px] flex justify-center items-center'>
                        <Loader />
                    </div>
                ) : (
                    <>
                        {/* Stats Cards — 2 cols on mobile, 4 on large */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
                            variants={containerVariants}
                        >
                            {[
                                { label: 'Total Orders', value: orders.length, bg: 'bg-blue-100', icon: <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" /> },
                                { label: 'Pending', value: pendingOrders, bg: 'bg-orange-100', icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" /> },
                                { label: 'Delivered', value: deliveredOrders, bg: 'bg-green-100', icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" /> },
                                { label: 'Total Spent', value: formatCurrency(totalAmoutSpent), bg: 'bg-purple-100', icon: <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" /> },
                            ].map((stat) => (
                                <motion.div
                                    key={stat.label}
                                    variants={cardVariants}
                                    className="bg-white rounded-xl p-3 sm:p-5 shadow-md border border-gray-100 overflow-hidden"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className=" overflow-hidden">
                                            <p className="text-gray-500 text-xs sm:text-sm font-medium leading-tight truncate">{stat.label}</p>
                                            <h3 className="text-base sm:text-2xl font-bold text-gray-800 mt-1 truncate">
                                                {stat.value}
                                            </h3>
                                        </div>
                                        <div className={`p-2 sm:p-3 ${stat.bg} rounded-lg `}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Recent Orders Section */}
                        <motion.div
                            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                            variants={itemVariants}
                        >
                            <div className="p-4 sm:p-5 border-b border-gray-200 flex justify-between items-center gap-2">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Orders</h2>
                                <Link to={'/user-dashboard/orders'}>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center whitespace-nowrap">
                                        View All <ArrowRight className="ml-1 h-4 w-4" />
                                    </button>
                                </Link>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {recentOrders.length === 0 ? (
                                    <p className="p-4 text-sm text-gray-500">No orders to show yet.</p>
                                ) : (
                                    recentOrders.map((order) => (
                                        <motion.div
                                            key={order._id}
                                            className="p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-200"
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <div className="flex flex-col gap-3">
                                                {/* Top Row */}
                                                <div className="flex items-start gap-3 min-w-0">
                                                    <img
                                                        src={order.orderItems[0].image}
                                                        alt={order.orderItems[0].name}
                                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                                                    />

                                                    <div className="flex-1 min-w-0 overflow-hidden">
                                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug break-words line-clamp-2">
                                                            {order.orderItems[0].name}
                                                        </h3>

                                                        <p className="mt-1 text-[11px] sm:text-xs text-gray-500 break-all leading-relaxed">
                                                            {order.orderId}
                                                        </p>

                                                        <p className="mt-1 text-[11px] sm:text-xs text-gray-400">
                                                            {formatDate(order.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Bottom Row */}
                                                <div className="flex items-center justify-between gap-2 pl-[60px] sm:pl-0 sm:justify-end sm:gap-3 flex-wrap">
                                                    <span
                                                        className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${getStatusColor(
                                                            order.orderStatus
                                                        )}`}
                                                    >
                                                        {order.orderStatus.charAt(0).toUpperCase() +
                                                            order.orderStatus.slice(1)}
                                                    </span>

                                                    <p className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">
                                                        {formatCurrency(order.orderSummary.totalAmount)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default AccountOverview;