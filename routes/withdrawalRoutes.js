const router = require('express').Router();
const withdrawalController = require('../controllers/withdrawalController');
const checkGroupMembership = require('../middleware/checkGroupMembership');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create withdrawal (with group membership check)
router.post('/create', checkGroupMembership, withdrawalController.createWithdrawal);

// Get user's withdrawals
router.get('/', withdrawalController.getWithdrawals);

module.exports = router; 