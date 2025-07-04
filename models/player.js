const mongoose = require('mongoose');
const Player = require('../models/Player');
const playerSchema = new mongoose.Schema({
    name: String,
    qrCodeID: String,
    status: {
        type: String,
        enum: ['alive', 'killed'],
        default: 'alive'
    }
});

module.exports = mongoose.model('Player', playerSchema);
