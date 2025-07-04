function isLoggedIn(req, res, next) {
    if (req.session && req.session.loggedIn) {
        return next();
    } else {
        res.redirect('/');
    }
}

module.exports = { isLoggedIn };
