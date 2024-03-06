const express = require("express");
const Router = express.Router();

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator")

const User = require("../models/User")

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

Router.get('/check/:username', async (req, res) => {
    const name = req.params.username;
    const user = await User.findOne({ where: { username: name } });

    if (user) {
        return res.json({ available: false });
    } else {
        return res.json({ available: true });
    }
})

Router.get("/signin", (req, res) => {
    res.render("signin", { message: req.flash('error'), loggedInUser: req.session.username });
});

Router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        req.flash('error', 'Invalid Username and Password Combination!');
        return res.redirect("/signin");
    }

    let user = await User.findOne({ where: { username } });
    let allowLoggin = await bcrypt.compare(password, user.passwordhash);
    if (!allowLoggin) {
        req.flash('error', 'Invalid Username and Password Combination!');
        return res.redirect("/signin");
    }
    req.session.username = username;
    res.locals.loggedInUser = username;
    req.flash("success", "Successfully Logged In");
    return res.redirect("/");
});

Router.get("/logout", (req, res) => {
    req.session.username = undefined;

    req.flash("success", "Successfully Logged Out");
    res.redirect('/');

})

Router.get("/generateotp", (req, res) => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "kartikvr20@gmail.com",
            pass: "kxjtddugspuaxcgh"
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let otp = otpGenerator.generate(6);
    let options = {
        to: "katik2129.be21@chitkara.edu.in",
        from: "kartikvr20@gmail.com",
        subject: "hi",
        text: `Your OTP: ${otp}`,
        html: `<h1>Your OTP: ${otp}</h1>`

    }
    transport.sendMail(options, (err) => {
        if (err) console.log(err);
    })

    return res.json({ otp: otp })

})

module.exports = Router;
