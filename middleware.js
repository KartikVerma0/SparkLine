function isLoggedIn(req, res, next) {
    req.session.redirectURL = req.originalUrl;
    if (!req.session.username) {
        return res.redirect("/signin");
    }
    next();
}

module.exports = { isLoggedIn };