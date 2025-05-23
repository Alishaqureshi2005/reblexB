const router = require('express').Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.post('/create', adminController.createAdmin);
router.delete('/user/:userId', adminController.deleteUser);
router.get('/users', adminController.getAllUsers);

module.exports = router;
