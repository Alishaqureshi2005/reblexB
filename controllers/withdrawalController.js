const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

const createWithdrawal = async (req, res) => {
  try {
    const { gameId, amount } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!gameId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Game ID and amount are required'
      });
    }

    if (amount < 5 || amount > 1500) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be between 5 and 1500'
      });
    }

    // Check user's balance
    const user = await User.findById(userId);
    if (!user || user.robuxBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Create withdrawal record
    const withdrawal = new Withdrawal({
      userId,
      gameId,
      amount,
      status: 'pending'
    });

    await withdrawal.save();

    // Deduct balance from user
    user.robuxBalance -= amount;
    await user.save();

    res.json({
      success: true,
      message: 'Withdrawal request created successfully',
      data: withdrawal
    });

  } catch (error) {
    console.error('Error creating withdrawal:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating withdrawal request'
    });
  }
};

const getWithdrawals = async (req, res) => {
  try {
    const userId = req.user._id;
    const withdrawals = await Withdrawal.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching withdrawals'
    });
  }
};

module.exports = {
  createWithdrawal,
  getWithdrawals
}; 