const express = require("express");
const connectDb = require("./config/db");
const app = express();

//connect database

connectDb();

app.get("/", (req, res) => res.send("API running"));

//define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profiles", require("./routes/api/profiles"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/auth", require("./routes/api/auth"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server listening at ${port}`));
