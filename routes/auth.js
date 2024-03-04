const express = require("express");
const Router = express.Router();

const User = require("../models/User")

Router.get("/create", (req, res) => {
    res.render("createAccount");
});

Router.post("/create", async (req, res) => {
    const { username, email, password, mobile, gender } = req.body;
    let newUser = await User.create({
        username, passwordhash: password, gender, mobile, email
    })
    res.redirect("/")
});

Router.get('/check/:username', async (req, res, next) => {
    const name = req.params.username;
    const user = await User.findOne({ where: { username: name } });

    if (user) {
        res.json({ available: false });
    }

    else res.json({ available: true });
})

Router.get("/signin", (req, res) => {
    res.render("signin");
});

Router.post("/signin", (req, res) => { });

module.exports = Router;
