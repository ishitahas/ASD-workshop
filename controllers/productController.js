const productService = require("../services/productService");
const { invalidateCache } = require("../middleware/cacheMiddleware");

async function getProducts(req, res) {
    try {
        const products = await productService.getProducts();

        return res.json(products);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

async function getProductById(req, res) {
    try {
        const product = await productService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.json(product);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

async function addProduct(req, res) {
    try {
        const product = await productService.addProduct(req.body);

        invalidateCache();

        return res.status(201).json(product);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

async function updateProduct(req, res) {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        invalidateCache();

        return res.json(product);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

async function deleteProduct(req, res) {
    try {
        const product = await productService.deleteProduct(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        invalidateCache();

        return res.json(product);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};