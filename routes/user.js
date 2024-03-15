const express = require("express");
const Router = express.Router();

const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "sparkline/users",
    },
});

const upload = multer({ storage: storage })

const User = require("../models/User")

const { isLoggedIn } = require("../middleware");

Router.get("/create", (req, res) => {
    res.render("createAccount", { loggedInUser: req.session.username });
});

Router.post("/create", async (req, res) => {
    const { username, email, password, mobile, gender } = req.body;
    const passwordhash = await bcrypt.hash(password, 12);
    let newUser = await User.create({
        username, passwordhash, gender, mobile, email
    })
    req.flash("success", "Successfully Created you Account!")
    res.redirect("/")
});

Router.post("/edit", isLoggedIn, async (req, res) => {
    const {
        firstname,
        lastname,
        gender,
        mobile,
        profiletext
    } = req.body;

    const username = req.session.username;

    try {
        const updatedUser = await User.update({ firstname: firstname, lastname: lastname, gender: gender, mobile: mobile, profiletext: profiletext }, { where: { username: username } })
        return res.status(200).json({ message: "Update Success", status: true })
    } catch {
        return res.status(500).json({ message: "Problem Updating Account", status: false });
    }

})

Router.post("/edit/profilepicture", isLoggedIn, upload.single('pic'), async (req, res) => {
    const username = req.session.username;
    try {
        await User.update({ pic: req.file.path }, { where: { username: username } });
        req.flash("success", "Successfully Uploaded profile picture");
        res.redirect("/dashboard");
    } catch {
        req.flash("error", "Error uploading profile picture");
        res.redirect("/dashboard");

    }

})

module.exports = Router;
