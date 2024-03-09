const express = require("express");
const Router = express.Router();

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator")

const User = require("../models/User");

const userRoutes = require("./user");

Router.use("/user", userRoutes);

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
    if (!user) {
        req.flash('error', 'Invalid Username and Password Combination!');
        return res.redirect("/signin");
    }
    let allowLoggin = await bcrypt.compare(password, user.passwordhash);
    if (!allowLoggin) {
        req.flash('error', 'Invalid Username and Password Combination!');
        return res.redirect("/signin");
    }
    req.session.userid = user.userid;
    req.session.username = username;
    res.locals.loggedInUser = username;
    req.flash("success", "Successfully Logged In");
    return res.redirect(req.session.redirectURL || "/");
});

Router.get("/logout", (req, res) => {
    req.session.username = undefined;

    req.flash("success", "Successfully Logged Out");
    res.redirect('/');

})

//configure otp generation according to user data

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
