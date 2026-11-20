const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

const productRoutes = require("./routes/productRoutes");

app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/", productRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});