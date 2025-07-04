const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/game/dashboard');
    }
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        req.session.loggedIn = true;
        return res.redirect('/game/dashboard');
    }
    res.render('login', { error: 'Invalid credentials' });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
