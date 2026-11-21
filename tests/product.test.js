const path = require("path");
const fs = require("fs/promises");
const request = require("supertest");

const testDbPath = path.join(__dirname, "test-db.json");

process.env.PRODUCTS_DB_PATH = testDbPath;
process.env.DB_READ_DELAY = "0";

const app = require("../app");
const { invalidateCache } = require("../middleware/cacheMiddleware");

const initialProducts = [
    { id: 1, name: "Mouse", price: 19.99 },
    { id: 2, name: "Keyboard", price: 49.99 }
];

beforeEach(async () => {
    await fs.writeFile(testDbPath, JSON.stringify(initialProducts, null, 2));
    invalidateCache();
});

afterAll(async () => {
    await fs.rm(testDbPath, { force: true });
});

describe("Product API Tests", () => {

    test("GET all products", async () => {
        const res = await request(app).get("/products");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    test("GET product by ID", async () => {
        const res = await request(app).get("/products/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Mouse");
    });

    test("GET missing product returns 404", async () => {
        const res = await request(app).get("/products/99");
        expect(res.statusCode).toBe(404);
    });

    test("POST creates a product", async () => {
        const res = await request(app)
            .post("/products")
            .send({ name: "Monitor", price: 199 });

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("Monitor");
    });

    test("POST rejects invalid data", async () => {
        const res = await request(app)
            .post("/products")
            .send({ name: "", price: -10 });

        expect(res.statusCode).toBe(400);
    });

    test("PUT replaces a product", async () => {
        const res = await request(app)
            .put("/products/1")
            .send({ name: "Gaming Mouse", price: 99 });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Gaming Mouse");
        expect(res.body.price).toBe(99);
    });

    test("PUT returns 404 for missing product", async () => {
        const res = await request(app)
            .put("/products/99")
            .send({ name: "New Product", price: 100 });

        expect(res.statusCode).toBe(404);
    });

    test("PATCH updates selected fields", async () => {
        const res = await request(app)
            .patch("/products/1")
            .send({ price: 30 });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Mouse");
        expect(res.body.price).toBe(30);
    });

    test("PATCH rejects empty data", async () => {
        const res = await request(app)
            .patch("/products/1")
            .send({});

        expect(res.statusCode).toBe(400);
    });

    test("DELETE removes a product", async () => {
        const res = await request(app).delete("/products/1");
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(1);
    });

    test("DELETE returns 404 for missing product", async () => {
        const res = await request(app).delete("/products/99");
        expect(res.statusCode).toBe(404);
    });

    test("GET uses cache", async () => {
        const first = await request(app).get("/products");
        const second = await request(app).get("/products");

        expect(first.headers["x-cache"]).toBe("MISS");
        expect(second.headers["x-cache"]).toBe("HIT");
    });

    test("POST invalidates cache", async () => {
        await request(app).get("/products");

        await request(app)
            .post("/products")
            .send({ name: "Monitor", price: 199 });

        const res = await request(app).get("/products");

        expect(res.headers["x-cache"]).toBe("MISS");
        expect(res.body).toHaveLength(3);
    });
});