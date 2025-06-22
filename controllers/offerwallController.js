const User = require('../models/User');
const RewardTransaction = require('../models/rewardTransaction');

exports.processOfferwallReward = async (req, res) => {
    try {
        const { user_id, reward, offer_id, status } = req.body;

        // Security Check
        const secret = req.headers['x-webhook-secret'];
        if (secret !== process.env.OFFERWALL_SECRET) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (status !== 'completed') {
            return res.status(400).json({ error: 'Offer not completed' });
        }

        // Prevent duplicate reward
        const existingTransaction = await RewardTransaction.findOne({ offer_id });
        if (existingTransaction) {
            return res.status(409).json({ error: 'Offer already processed' });
        }

        // Find user
        const user = await User.findOne({ robloxId: user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update balance
        user.robuxBalance = (user.robuxBalance || 0) + reward;
        await user.save();

        // Log transaction
        await RewardTransaction.create({
            user_id,
            offer_id,
            reward,
            status
        });

        return res.status(200).json({ 
            message: 'Reward added successfully',
            newBalance: user.robuxBalance
        });

    } catch (err) {
        console.error('Offerwall reward processing error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Admin routes for monitoring and setting limits
exports.getRewardTransactions = async (req, res) => {
    try {
        const transactions = await RewardTransaction.find()
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(transactions);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUserRewardHistory = async (req, res) => {
    try {
        const { user_id } = req.params;
        const transactions = await RewardTransaction.find({ user_id })
            .sort({ timestamp: -1 });
        res.json(transactions);
    } catch (err) {
        console.error('Error fetching user transactions:', err);
        res.status(500).json({ error: 'Server error' });
    }
}; 