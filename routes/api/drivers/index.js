const express = require("express");
const router = express.Router();
const { authenticating, authorizing } = require("../../../middleware/auth");
const driverController = require("./drivers");

router.post(
  "/create-profile",
  authenticating,
  authorizing(["driver"]),
  driverController.createDriverProfile
);

router.get("/profile/:userId", driverController.getDriverProfile);

router.delete(
  "/delete-profile/:driverId",
  authenticating,
  authorizing(["driver"]),
  driverController.deleteDriverProfile
);
module.exports = router;
