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
router.post(
  "/rate-driver/:driverId",
  authenticating,
  authorizing(["passenger"]),
  userController.rateDriver
);

router.get("/trip-history", authenticating, userController.getTripHistory);

router.delete("/delete", authenticating, userController.deleteUser);

router.put("/update", authenticating, userController.updateUser);
router.put("/change-password", authenticating, userController.changePassword);
router.post(
  "/upload-avatar",
  authenticating,
  upload.single("avatar"),
  userController.uploadAvatar
);
router.get("/:id", authenticating, userController.getUserById);

router.get("/", userController.getAllUser);
module.exports = router;
