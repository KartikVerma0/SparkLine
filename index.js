const express = require("express");
const app = express();

const path = require("path");

const pagesRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", pagesRoutes);
app.use("/", authRoutes);

app.listen("3000", () => {
    console.log("Listening on port 3000");
});
