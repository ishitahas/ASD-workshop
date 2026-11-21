const productService = require("../services/productService");
const { invalidateCache } = require("../middleware/cacheMiddleware");

function validateProduct(data, requireAll = false) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return "Invalid product data";
    }

    const allowedFields = ["name", "price"];

    for (const key of Object.keys(data)) {
        if (!allowedFields.includes(key)) {
            return `Invalid field: ${key}`;
        }
    }

    if (requireAll && (!("name" in data) || !("price" in data))) {
        return "Name and price are required";
    }

    if ("name" in data) {
        if (typeof data.name !== "string" || data.name.trim() === "") {
            return "Name must be a non-empty string";
        }
    }

    if ("price" in data) {
        if (typeof data.price !== "number" || !Number.isFinite(data.price) || data.price <= 0) {
            return "Price must be a positive number";
        }
    }

    return null;
}

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
        const error = validateProduct(req.body, true);

        if (error) {
            return res.status(400).json({ message: error });
        }

        const product = await productService.addProduct(req.body);

        invalidateCache();

        return res.status(201).json(product);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// PUT: Complete replacement
async function replaceProduct(req, res) {
    try {
        const error = validateProduct(req.body, true);

        if (error) {
            return res.status(400).json({ message: error });
        }

        const product = await productService.replaceProduct(
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

// PATCH: Partial update
async function updateProduct(req, res) {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "At least one field is required" });
        }

        const error = validateProduct(req.body);

        if (error) {
            return res.status(400).json({ message: error });
        }

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
    replaceProduct,
    updateProduct,
    deleteProduct
};