const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.get('/all', userController.getAllUsers)
router.post('/register', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;