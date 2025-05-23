const router = require('express').Router();
const withdrawalController = require('../controllers/withdrawController');
const authMiddleware = require('../middleware/authMiddleware');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const axios = require('axios');

// Helper: Get user ID from username
async function getUserIdFromUsername(username) {
  const res = await axios.post(
    'https://users.roblox.com/v1/usernames/users',
    { usernames: [username] }
  );
  return res.data.data[0]?.id;
}

// Helper: Get CSRF token
async function getCsrfToken(cookie) {
  try {
    await axios.post('https://auth.roblox.com/v2/logout', {}, {
      headers: { Cookie: `.ROBLOSECURITY=${cookie}` }
    });
  } catch (err) {
    return err.response.headers['x-csrf-token'];
  }
}

// User routes
router.use(authMiddleware);
router.post('/create', withdrawalController.createWithdrawal);
router.get('/history', withdrawalController.getWithdrawalHistory);

// Admin routes
router.use('/admin', adminAuthMiddleware);
router.get('/admin/pending', withdrawalController.getAllPendingWithdrawals);
router.post('/admin/process', withdrawalController.processWithdrawal);

// Withdraw endpoint
router.post('/withdraw', withdrawalController.withdrawGroupPayout);

module.exports = router;