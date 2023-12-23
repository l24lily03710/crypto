var express = require("express");
var router = express.Router();
var user_controller = require("../src/controllers/user");

router.get("/", user_controller.getAll);
router.get("/profile/:id", user_controller.getById);
router.put("/profile/:id", user_controller.update);
router.delete("/profile/:id", user_controller.delete);
router.get("/favorite_crypto", user_controller.getAllFavoriteCryptos);

module.exports = router;
