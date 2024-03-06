const express = require("express");
const Router = express.Router();

Router.get("/", (req, res) => {
    res.render("home", { message: req.flash("success"), loggedInUser: req.session.username });
});

module.exports = Router;
