if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}
const express = require("express");
const app = express();

const sequelize = require("./database/config")

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectToDatabase();



const path = require("path");

const pagesRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", pagesRoutes);
app.use("/", authRoutes);

app.listen("3000", () => {
    console.log("Listening on port 3000");
});