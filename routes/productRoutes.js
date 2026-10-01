const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");

const { cacheMiddleware } = require("../middleware/cacheMiddleware");

// GET all products
router.get("/products", cacheMiddleware, productController.getProducts);

// GET one product
router.get("/products/:id", cacheMiddleware, productController.getProductById);

// POST
router.post("/products", productController.addProduct);

// PUT
router.put("/products/:id", productController.updateProduct);

// PATCH
router.patch("/products/:id", productController.updateProduct);

// DELETE
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;