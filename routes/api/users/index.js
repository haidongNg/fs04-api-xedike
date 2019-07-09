const express = require("express");
const userController = require("./users");
const { authenticating, authorizing } = require("../../../middleware/auth");
const upload = require("../../../middleware/uploadImage");
const router = express.Router();
const passport = require("passport");

router.post("/register", userController.register);

router.post("/login", userController.login);
router.get(
  "/test-private",
  authenticating,
  // passport.authenticate('jwt', {session: false}),
  authorizing(["passenger", "admin"]),
  userController.test_private
);

// router.get("/", userController.getAllUser);

router.delete("/delete", authenticating, userController.deleteUser);

router.put("/update", authenticating, userController.updateUser);

router.post(
  "/upload-avatar",
  authenticating,
  upload.single("avatar"),
  userController.uploadAvatar
);

router.get('/:id', authenticating, userController.getUserById)

module.exports = router;
