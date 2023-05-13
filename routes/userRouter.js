const express = require('express');
const { userController } = require('../controllers/userController');
const checkAuth = require('../utils/checkAuth');

const router = express.Router();

router.put('/:id/avatarUrl', checkAuth, userController.UpdateAvaratUrl);
router.post('/:userId/save-post/:postId', checkAuth, userController.savePost);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/:userId/like-post/:postId', checkAuth, userController.likes);
router.delete('/:id', userController.delete);
router.put('/:id', userController.update);

module.exports = router;
