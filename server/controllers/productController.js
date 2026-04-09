// const { default: Fuse } = require("fuse.js")
const Product = require("../models/Product")
const Fuse = require('fuse.js')


exports.getProducts = async (req, res) => {
    // console.log('query  request:', { ...req.query });
    const { categories, brands, priceRange, search } = { ...req.query }
    if (!categories && !brands && !search && priceRange) {
        let products = await Product.find()
        return res.status(200).json({ msg: 'fetched products successfully.', products: products })
    }

    console.log("ddd", req.query);


    // return res.status(404).json({ msg: 'fetched products successfully.' })
    try {
        let query = {}
        if (categories) query.category = Array.isArray(categories) ? { $in: categories } : categories
        if (brands) query.brand = Array.isArray(brands) ? { $in: brands } : brands
        if (priceRange) {
            const [min, max] = priceRange.split(',')
            query.price = { $gte: Number(min), $lte: Number(max) }
        }
        // console.log(query);  

        let products = await Product.find(query)
        // console.log("data:", data);


        if (search) {
            // console.log("Search term:", search);

            const fuse = new Fuse(products, {
                threshold: 0.4,
                keys: ['name', 'description', 'brand', 'tags', 'category']
            })

            const results = fuse.search(search)
            products = results.map(r => r.item)
            // console.log("Search results:", results);
        }
        console.log(products.length);





        res.status(200).json({ msg: 'fetched products successfully.', products: products })
    } catch (error) {
        console.error('Server error while fetching products:::', error.message);
        // res.status(500).json({ msg: 'Server error while fetching products.', products: data })
    }

}

exports.getSingleProduct = async (req, res) => {
    const { id } = req.params
    // console.log('id:', id)
    try {
        const singleProduct = await Product.findById(id)
        await singleProduct.populate({
            path: 'reviews.user',
            select: 'avatar username email'
        })
        // console.log('singleProduct:', singleProduct);
        res.status(200).json({ msg: 'fetched single product', product: singleProduct })
    } catch (err) {
        console.error(err)
    }
}


exports.getFilters = async (req, res) => {
    try {
        const categories = await Product.distinct('category')
        const brands = await Product.distinct('brand')
        // console.log('categories:', categories, 'brands:', brands);
        res.status(200).json({ categories, brands })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
}

// Add Review to Product (Authenticated Users) 
exports.addReview = async (req, res) => {
    const { rating, comment } = req.body
    const { id: prodId } = req.params 
    

    const userId = req.user.id

    try {
        const product = await Product.findById(prodId)

        product.reviews.push({
            user: userId,
            rating: rating,
            comment: comment
        })

        await product.populate({
            path: 'reviews.user',
            select: 'username email'
        })


        product.calculateRating()
        await product.save()
        res.status(200).json({ msg: 'Review added', product: product })
    } catch (error) {
        console.error('Error while adding review:::', error.message);
        res.status(500).json({ msg: 'Server error while adding review.' })
    }
};


exports.deleteProduct = async (req, res) => {
    console.log(req.user);
    const { role } = req.user
    const { id } = req.params
    console.log('delete product id:::', req.params.id);
    if (role !== 'admin') return res.status(403).json({ msg: 'Unauthorized to delete product' })

    try {
        const product = await Product.findByIdAndDelete({ _id: id })
        console.log('product:::', product);
        res.status(200).json({ msg: 'Product deleted successfully' })
    } catch (error) {
        console.error(error.message);

        res.status(500).json({ msg: 'Server error while deleting product' })
    }

}

exports.editProduct = async (req, res) => {
    try {

        const { id } = req.params
        const { product } = req.body
        const { role } = req.user
        console.log(role);

        if (role !== 'admin') return res.status(403).json({ msg: 'Unauthorized to edit product' })
        console.log(req.body);
        const updatedProduct = await Product.findByIdAndUpdate(id,
            { $set: product },
            { new: true, runValidators: true }
        )

        res.status(200).json({ msg: 'Product updated successfully.' })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error while editing product.' })
    }
}

exports.addProduct = async (req, res) => {
    const { product } = req.body
    const { role } = req.user
    console.log(role);

    try {
        if (role !== 'admin') return res.status(403).json({ msg: 'Unauthorized to edit product' })
        console.log(req.body);
        const newProduct = new Product(product)
        await newProduct.save()
        // console.log('newProduct:::', newProduct);
        res.status(200).json({ msg: 'Product added successfully.' })


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error while adding new product.' })
    }
}