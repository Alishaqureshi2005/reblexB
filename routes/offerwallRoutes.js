const express = require('express');
const router = express.Router();
const offerwallController = require('../controllers/offerwallController');
const { authenticateAdmin } = require('../middleware/auth');

// Webhook endpoint for offer completion
router.post('/webhook/offer-completed', offerwallController.processOfferwallReward);

// Admin routes for monitoring
router.get('/admin/transactions', authenticateAdmin, offerwallController.getRewardTransactions);
router.get('/admin/user/:user_id/transactions', authenticateAdmin, offerwallController.getUserRewardHistory);

module.exports = router; 