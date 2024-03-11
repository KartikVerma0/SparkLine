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
    return res.redirect(req.session.redirectURL || "/posts");
});

Router.get("/logout", (req, res) => {
    req.session.username = undefined;
    req.session.userid = undefined;
    req.flash("success", "Successfully Logged Out");
    res.redirect('/');

})

//configure otp generation according to user data

Router.get("/generateotp/:email", (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ otp: "Email not valid" });
    }

    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let otp = otpGenerator.generate(6);
    let options = {
        to: email,
        from: process.env.NODEMAILER_EMAIL,
        subject: `SparkLine - OTP ${otp}`,
        text: `Your Email verification OTP: ${otp}`,
        html: `<h2>Your Email verification OTP: ${otp}</h2>`

    }
    transport.sendMail(options, (err) => {
        if (err) console.log(err);
    })

    return res.json({ otp: otp })

})

module.exports = Router;
