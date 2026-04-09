import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Package, } from "lucide-react";
import Loader from '../common/Loader'
import ProductCard from "./ProductCard";
import { useOutletContext } from "react-router-dom";


// Product Management Component
const ProductManagement = () => {

    const {
        products,
        loading,
        categories,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        deleteConfirm,
        setDeleteConfirm,
        handleEditProduct,
        handleCreateProduct,
        handleDeleteProduct
    } = useOutletContext()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className='p-6'
        >
            <div className="flex justify-between items-center mb-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateProduct}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    <Plus size={20} />
                    <span>Add Product</span>
                </motion.button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter size={20} className="text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {['all', ...categories].map(category => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {
                loading ? (
                    <div className="bg-white flex justify-center  items-center min-h-[300px] p-8 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        < Loader />
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {products.length === 0 ? (
                            <div className="p-8 text-center">
                                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-600">No products found. Try adjusting your search or add a new product.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product, index) => (
                                    <ProductCard key={index} product={product} index={index} onEditProduct={handleEditProduct} setDeleteConfirm={setDeleteConfirm} />
                                ))}
                            </div>

                        )}
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full"
                        >
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(deleteConfirm)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
export default ProductManagement