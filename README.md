# Product Management REST API

A RESTful Product Management API built using Node.js and Express.js. It supports CRUD operations, request validation, JSON file-based storage, automated testing, and in-memory caching.

## Features

- Create, read, update, and delete products
- Separate PUT and PATCH operations
- Request body validation
- Proper HTTP status codes and error handling
- JSON file-based data storage
- In-memory response caching
- 60-second cache expiration
- Cache invalidation after data modifications
- Simulated 1.5-second database read delay
- Automated API testing using Jest and Supertest

## Tech Stack

- Node.js
- Express.js
- JavaScript
- Jest
- Supertest
- JSON File Storage

## Project Structure

    asd-workshop/
    ├── controllers/
    │   └── productController.js
    ├── database/
    │   └── productDatabase.js
    ├── middleware/
    │   └── cacheMiddleware.js
    ├── routes/
    │   └── productRoutes.js
    ├── services/
    │   └── productService.js
    ├── tests/
    │   └── product.test.js
    ├── app.js
    ├── server.js
    ├── db.json
    ├── package.json
    └── .gitignore

## Installation

Clone the repository:

    git clone https://github.com/ishitahas/ASD-workshop.git
    cd asd-workshop

Install dependencies:

    npm install

## Running the Server

    npm run server

Server runs at:

    http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /products | Get all products |
| GET | /products/:id | Get a product by ID |
| POST | /products | Create a product |
| PUT | /products/:id | Replace a complete product |
| PATCH | /products/:id | Update selected fields |
| DELETE | /products/:id | Delete a product |

## Example Requests

Create a product:

    curl -X POST http://localhost:3000/products \
    -H "Content-Type: application/json" \
    -d '{"name":"Keyboard","price":499}'

Get all products:

    curl http://localhost:3000/products

Update a product:

    curl -X PATCH http://localhost:3000/products/1 \
    -H "Content-Type: application/json" \
    -d '{"price":1500}'

Delete a product:

    curl -X DELETE http://localhost:3000/products/1

## Caching

GET requests use in-memory caching with a 60-second expiration.

- Cache MISS: Data is fetched from the JSON file.
- Cache HIT: Cached data is returned.
- Cache invalidation: Cache is cleared after successful POST, PUT, PATCH, and DELETE operations.

The X-Cache response header indicates cache hits and misses.

## Automated Testing

Run the test suite:

    npm test

The project includes 13 automated tests covering CRUD operations, validation, error handling, caching, and cache invalidation.

## Error Handling

- 200: Successful request
- 201: Resource created
- 400: Invalid request data
- 404: Product not found
- 500: Internal server error
