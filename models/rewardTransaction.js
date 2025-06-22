const mongoose = require('mongoose');

const rewardTransactionSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    offer_id: { type: String, required: true, unique: true },
    reward: { type: Number, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RewardTransaction', rewardTransactionSchema); 