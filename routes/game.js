const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const QRCode = require('qrcode');
const { isLoggedIn } = require('../middleware/auth');

let lastKillTime = 0; // cooldown

// generate 12 qr code
router.get('/generate', isLoggedIn, async (req, res) => {
    await Player.deleteMany();

    const names = [
        "Player1", "Player2", "Player3", "Player4", "Player5", "Player6",
        "Player7", "Player8", "Player9", "Player10", "Player11", "Player12"
    ];

    const players = [];

    for (const name of names) {
        const qrCodeID = `${name}-${Math.floor(1000 + Math.random() * 9000)}`;
        const qrPath = `public/qrcodes/${qrCodeID}.png`;

        await QRCode.toFile(qrPath, qrCodeID);

        const newPlayer = new Player({ name, qrCodeID, status: "alive" });
        await newPlayer.save();

        players.push(newPlayer);
    }

    res.render('dashboard', { players });
});

// get scan page
router.get('/scan', isLoggedIn, (req, res) => {
    res.render('scan', { result: null });
});

// scan + kill
router.post('/scan', isLoggedIn, async (req, res) => {
    const { qrCodeID } = req.body;
    const player = await Player.findOne({ qrCodeID });

    const now = Date.now();
    if (now - lastKillTime < 40000) {
        const wait = Math.ceil((40000 - (now - lastKillTime)) / 1000);
        return res.render('scan', { result: ` Cooldown active! Wait ${wait} seconds.` });
    }

    if (!player) {
        return res.render('scan', { result: ' Invalid QR Code!' });
    }

    if (player.status === 'killed') {
        return res.render('scan', { result: ` ${player.name} is already dead!` });
    }

    player.status = 'killed';
    await player.save();

    lastKillTime = now;
    res.render('scan', { result: ` ${player.name} has been killed!` });
});

// get dashboard page
router.get('/dashboard', isLoggedIn, async (req, res) => {
    const players = await Player.find();
    res.render('dashboard', { players });
});

module.exports = router;
