const path = require('path')

const logoutView = (req, res) => {
    setTimeout(() => {
        req.session.destroy();
    }, 3000);
    res.sendFile(path.join(__dirname, '..', 'public', 'logout.html'))
}

const closingSession = (req, res) => {


}

module.exports = {
    logoutView,
    closingSession
}