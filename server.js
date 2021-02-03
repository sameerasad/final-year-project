const express = require("express");
const connectDb = require("./config/db");
const app = express();

//connect database

connectDb();

app.get("/", (req, res) => res.send("API running"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server listening at ${port}`));
