const express = require('express');
const UserController = require('../middleware/userController');
const authentication = require('../middleware/authentication');


const router = new express.Router();

router.post('/users', UserController.create);

router.post('/users/login', UserController.login);

router.post('/users/logout', authentication, UserController.logout);

router.post('/users/logout-all', authentication, UserController.logoutAll);

router.get('/users/me', authentication, UserController.getLoggedUser);

router.patch('/users/me', authentication, UserController.updateLoggedUser);

router.delete('/users/me', authentication, UserController.deleteLoggedUser);


module.exports = router;