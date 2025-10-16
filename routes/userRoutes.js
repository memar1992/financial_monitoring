const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleWare');

router.get('/', auth, userController.getUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', auth, userController.createUser);

module.exports = router;
