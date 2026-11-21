const fs = require("fs/promises");
const path = require("path");

const pathToFile = process.env.PRODUCTS_DB_PATH || path.join(__dirname, "..", "db.json");

async function readProducts() {
    await new Promise((resolve) => {
        setTimeout(resolve, Number(process.env.DB_READ_DELAY ?? 1500));

    });

    const data = await fs.readFile(pathToFile, "utf-8");
    return JSON.parse(data);
}

async function writeProducts(products) {
    await fs.writeFile(pathToFile, JSON.stringify(products, null, 2));
}

async function getProducts() {
    
    return await readProducts();
}

async function getProductById(id) {
    const products = await readProducts();
    return products.find((item) => String(item.id) === String(id));
}

async function addProduct(product) {
    const products = await readProducts();

    const newId = products.length > 0
        ? Math.max(...products.map((item) => item.id)) + 1
        : 1;

    const newProduct = {
        id: newId,
        ...product
    };

    products.push(newProduct);
    await writeProducts(products);

    return newProduct;
}

// PUT: Replace the complete product
async function replaceProduct(id, data) {
    const products = await readProducts();

    const index = products.findIndex(
        (item) => String(item.id) === String(id)
    );

    if (index === -1) return null;

    products[index] = {
        id: products[index].id,
        ...data
    };

    await writeProducts(products);
    return products[index];
}

// PATCH: Update only the supplied fields
async function updateProduct(id, data) {
    const products = await readProducts();

    const index = products.findIndex(
        (item) => String(item.id) === String(id)
    );

    if (index === -1) return null;

    products[index] = {
        ...products[index],
        ...data,
        id: products[index].id
    };

    await writeProducts(products);
    return products[index];
}

async function deleteProduct(id) {
    const products = await readProducts();

    const index = products.findIndex(
        (item) => String(item.id) === String(id)
    );

    if (index === -1) return null;

    const deletedProduct = products[index];

    products.splice(index, 1);
    await writeProducts(products);

    return deletedProduct;
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    replaceProduct,
    updateProduct,
    deleteProduct
};