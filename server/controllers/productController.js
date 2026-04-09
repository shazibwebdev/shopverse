const Product = require("../models/Product")
const Fuse = require('fuse.js')


exports.getProducts = async (req, res) => {
    const { categories, brands, priceRange, search, page = 1, limit = 12 } = { ...req.query }

    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.max(1, parseInt(limit))
    const skip = (pageNum - 1) * limitNum

    try {
        let query = {}
        if (categories) query.category = Array.isArray(categories) ? { $in: categories } : categories
        if (brands) query.brand = Array.isArray(brands) ? { $in: brands } : brands
        if (priceRange) {
            const [min, max] = priceRange.split(',')
            query.price = { $gte: Number(min), $lte: Number(max) }
        }

        if (search) {
            const allProducts = await Product.find(query)
            const fuse = new Fuse(allProducts, {
                threshold: 0.4,
                keys: ['name', 'description', 'brand', 'tags', 'category']
            })
            const results = fuse.search(search).map(r => r.item)
            const totalProducts = results.length
            const totalPages = Math.ceil(totalProducts / limitNum)
            const paginated = results.slice(skip, skip + limitNum)

            return res.status(200).json({
                msg: 'fetched products successfully.',
                products: paginated,
                totalProducts,
                totalPages,
                currentPage: pageNum
            })
        }


        const totalProducts = await Product.countDocuments(query)
        const totalPages = Math.ceil(totalProducts / limitNum)
        const products = await Product.find(query).skip(skip).limit(limitNum)

        res.status(200).json({
            msg: 'fetched products successfully.',
            products,
            totalProducts,
            totalPages,
            currentPage: pageNum
        })
    } catch (error) {
        console.error('Server error while fetching products:::', error.message)
        res.status(500).json({ msg: 'Server error while fetching products.' })
    }
}

exports.getSingleProduct = async (req, res) => {
    const { id } = req.params
    try {
        const singleProduct = await Product.findById(id)
        await singleProduct.populate({
            path: 'reviews.user',
            select: 'avatar username email'
        })
        res.status(200).json({ msg: 'fetched single product', product: singleProduct })
    } catch (err) {
        console.error(err)
    }
}

exports.getFilters = async (req, res) => {
    try {
        const categories = await Product.distinct('category')
        const brands = await Product.distinct('brand')
        res.status(200).json({ categories, brands })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
}

exports.addReview = async (req, res) => {
    const { rating, comment } = req.body
    const { id: prodId } = req.params
    const userId = req.user.id

    try {
        const product = await Product.findById(prodId)
        product.reviews.push({ user: userId, rating, comment })
        await product.populate({ path: 'reviews.user', select: 'username email' })
        product.calculateRating()
        await product.save()
        res.status(200).json({ msg: 'Review added', product })
    } catch (error) {
        console.error('Error while adding review:::', error.message)
        res.status(500).json({ msg: 'Server error while adding review.' })
    }
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        await Product.findByIdAndDelete({ _id: id })
        res.status(200).json({ msg: 'Product deleted successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error while deleting product' })
    }
}

exports.editProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { product } = req.body
        await Product.findByIdAndUpdate(id, { $set: product }, { new: true, runValidators: true })
        res.status(200).json({ msg: 'Product updated successfully.' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error while editing product.' })
    }
}

exports.addProduct = async (req, res) => {
    const { product } = req.body
    try {
        const newProduct = new Product(product)
        await newProduct.save()
        res.status(200).json({ msg: 'Product added successfully.' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server error while adding new product.' })
    }
}
