var express = require('express');
var router = express.Router();
var user_controller = require("../src/controllers/user");

router.post("/", user_controller.create);
router.get("/", user_controller.getAll);
router.get("/:id", user_controller.getById);
router.put("/:id", user_controller.update);
router.delete("/:id", user_controller.delete);

module.exports = router;
