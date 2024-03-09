const express = require("express");
const Router = express.Router();

const multer = require("multer");

const upload = multer({ dest: 'public/uploads/posts' })

const User = require("../models/User");
const Post = require("../models/Post");

const { isLoggedIn } = require("../middleware");

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

Router.get("/posts", isLoggedIn, async (req, res) => {
    const username = req.session.username;
    const loggedInUser = await User.findOne({ where: { username: username } });
    const posts = await Post.findAll({
        include: [{ model: User, attributes: ['username', 'pic'] }]
    });
    const isSuccessMessage = req.flash("success").length ? true : false;

    res.render('posts', { loggedInUser, message: isSuccessMessage ? req.flash('success') : req.flash('error'), status: isSuccessMessage ? true : false, posts });
})

Router.post("/posts", upload.single('media'), async (req, res) => {
    const { posttext } = req.body;
    const media = req.file;
    const userid = req.session.userid;
    console.log(posttext, media.path, userid);
    try {
        await Post.create({
            posttext: posttext,
            userid: userid,
            media: media.path.substring(7),
        })
        req.flash("success", "Created new post")
    } catch (e) {
        req.flash("error", e.message)
    }
    res.redirect('/posts');
})

module.exports = Router;
