var express = require('express');
var router = express.Router();
var user_controller = require("../src/controllers/user");

// Uncomment this route if it is required
//router.post("/", user_controller.create);
router.get("/", user_controller.getAll);
//router.delete("/:id", user_controller.delete);

router.get("/profile/:id", user_controller.getById);
router.put("/profile/:id", user_controller.update);

module.exports = router;
