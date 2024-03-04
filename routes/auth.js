const express = require("express");
const Router = express.Router();

Router.get("/create", (req, res) => {
    res.render("createAccount");
});

Router.post("/create", (req, res) => {});

Router.get("/signin", (req, res) => {
    res.render("signin");
});

Router.post("/signin", (req, res) => {});

module.exports = Router;
