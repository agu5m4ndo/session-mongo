const path = require('path');

const getHtml = async(req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
}

const openingSession = (req, res) => {
    if (!req.session.username) {
        req.session.username = req.body.username
    }
    res.redirect('http://localhost:8080/')
}

const sessionData = (req, res) => {
    if (req.session) {
        res.status(200).json({ username: req.session.username })
    } else res.status(404).json({ message: 'Session has not been created' })
}

module.exports = {
    getHtml,
    openingSession,
    sessionData
}