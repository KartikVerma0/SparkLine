const express = require("express");
const Router = express.Router();

const User = require("../models/User");


const postRoute = require('./post');

const { isLoggedIn } = require("../middleware");

Router.use('/posts', postRoute);

Router.get("/", (req, res) => {
    res.render("home", { message: req.flash("success"), status: true, loggedInUser: req.session.username });
});

Router.get("/dashboard", isLoggedIn, async (req, res) => {
    try {
        const username = req.session.username;
        const loggedInUser = await User.findOne({ where: { username: username } });
        res.render("dashboard", { loggedInUser, successMessage: req.flash("success"), errorMessage: req.flash("error") });
    } catch {
        return res.redirect("/signin");
    }

});


module.exports = Router;
