const express = require("express");
const Router = express.Router();

const multer = require("multer");
const upload = multer({ dest: 'public/uploads/posts' })

const User = require("../models/User");
const Post = require("../models/Post");

const { isLoggedIn } = require("../middleware");

Router.get("/", isLoggedIn, async (req, res) => {
    const username = req.session.username;
    const loggedInUser = await User.findOne({ where: { username: username } });
    const posts = await Post.findAll({
        include: [{ model: User, attributes: ['username', 'pic'] }]
    });
    const successMessage = req.flash("success");
    const isSuccessMessage = successMessage.length ? true : false;

    res.render('posts', { loggedInUser, message: isSuccessMessage ? successMessage : req.flash('error'), status: isSuccessMessage ? true : false, posts });
})

Router.post("/", isLoggedIn, upload.single('media'), async (req, res) => {
    const { posttext } = req.body;
    const media = req.file;
    const userid = req.session.userid;
    try {
        await Post.create({
            posttext: posttext,
            userid: userid,
            media: media.path.substring(6),
        })
        req.flash("success", "Created new post")
    } catch (e) {
        req.flash("error", "Kindly upload correct information!")
    }
    res.redirect('/posts');
})

Router.get("/edit/:postid", isLoggedIn, async (req, res) => {
    const { postid } = req.params;
    const userid = req.session.userid;
    try {
        const post = await Post.findOne({ where: { postid: postid } });
        if (post.userid !== userid) {
            req.flash("error", "Not Authorized");
            return res.status(401).redirect("/")
        }
        return res.render('editPost', { loggedInUser: { userid: userid }, post: post });
    } catch (e) {
        req.flash("error", "Post Not Found");
        return res.redirect("/posts");
    }
})

Router.post("/edit/:postid", isLoggedIn, async (req, res) => {
    const { posttext } = req.body;
    const { postid } = req.params;

    const userid = req.session.userid;
    try {
        const post = await Post.findOne({ where: { postid: postid } });
        if (post.userid !== userid) {
            req.flash("error", "Not Authorized");
            return res.status(401).redirect("/")
        }
        try {

            await Post.update({ posttext: posttext }, { where: { postid: postid } });
        } catch (e) {
            req.flash("error", "Error updating post!");
            return res.redirect("/posts");
        }
        req.flash("success", "Successfully updated post");
        return res.redirect("/posts");
    } catch (e) {
        req.flash("error", "Post Not Found");
        return res.redirect("/posts");
    }
})

Router.get("/delete/:postid", isLoggedIn, async (req, res) => {
    const { postid } = req.params;
    try {
        await Post.destroy({
            where: {
                postid: postid
            }
        })
        req.flash("success", "Successfully Deleted Post")
        res.redirect("/posts");
    } catch (e) {
        req.flash("error");
        return res.redirect("/posts");
    }
})

module.exports = Router;