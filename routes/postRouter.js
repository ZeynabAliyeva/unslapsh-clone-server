const express = require('express');
const { postController } = require('../controllers/postController');
const checkAuth = require('../utils/checkAuth');
const handleValidationErrors = require('../utils/handleValidationErrors');

const router = express.Router();

router.get('/', postController.getAll);
router.get('/:id', postController.getPost);
router.post('/', checkAuth, handleValidationErrors, postController.create);
router.delete('/:id', checkAuth, postController.remove);
router.put('/comments/post', checkAuth, postController.commentsAdd);

module.exports = router;
