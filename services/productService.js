const productDatabase = require("../database/productDatabase");

async function getProducts() {
    return await productDatabase.getProducts();
}

async function getProductById(id) {
    return await productDatabase.getProductById(id);
}

async function addProduct(product) {
    return await productDatabase.addProduct(product);
}

async function replaceProduct(id, data) {
    return await productDatabase.replaceProduct(id, data);
}

async function updateProduct(id, data) {
    return await productDatabase.updateProduct(id, data);
}

async function deleteProduct(id) {
    return await productDatabase.deleteProduct(id);
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    replaceProduct,
    updateProduct,
    deleteProduct
};