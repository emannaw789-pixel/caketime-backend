const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
// Home Route
app.get("/", (req, res) => {
    res.send("CakeTime Backend Running 🍰");
});

// Save Order
app.post("/place-order", (req, res) => {

    const newOrder = req.body;

    fs.readFile("orders.json", "utf8", (err, data) => {

        let orders = [];

        if (!err && data) {
            orders = JSON.parse(data);
        }

        orders.push({
            id: Date.now(),
            ...newOrder
        });

        fs.writeFile(
            "orders.json",
            JSON.stringify(orders, null, 2),
            err => {

                if (err) {
                    return res.status(500).json({
                        message: "Error saving order"
                    });
                }

                res.json({
                    message: "Order saved successfully 🎉"
                });
            }
        );
    });
});

// Get All Orders
app.get("/orders", (req, res) => {

    fs.readFile("orders.json", "utf8", (err, data) => {

        if (err) {
            return res.json([]);
        }

        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
