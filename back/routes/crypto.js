var express = require('express');
var router = express.Router();
var crypto_controller = require("../src/controllers/crypto");

router.post("/", crypto_controller.create);
router.delete("/:id", crypto_controller.delete);
router.get("/:id", crypto_controller.getById);
router.get("/", crypto_controller.getAll);

module.exports = router;