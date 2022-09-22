const auth = (req, res, next) => {
    if (!req.session.username && req.session != null) {
        res.redirect('/login')
    } else {
        next();
    }
}

module.exports = { auth };