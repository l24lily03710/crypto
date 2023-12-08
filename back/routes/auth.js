var express = require('express');
var router = express.Router();
var login_controller = require("../src/controllers/auth");

router.post("/login", login_controller.login);
router.post("/register", login_controller.register);

module.exports = router;