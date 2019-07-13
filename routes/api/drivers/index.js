const express = require("express");
const router = express.Router();
const { authenticating, authorizing } = require("../../../middleware/auth");
const driverController = require("./drivers");

router.get("/profile/:userId", driverController.getDriverProfile);

router.delete(
  "/delete-profile",
  authenticating,
  authorizing(["driver"]),
  driverController.deleteDriverProfile
);


router.delete(
  "/delete-car/:carId",
  authenticating,
  authorizing(["driver"]),
  driverController.deleteCarInfoDriver
);

router.put(
  "/update-car/:carId",
  authenticating,
  authorizing(["driver"]),
  driverController.updateCarInfoDriver
);
router.post(
  "/add-car",
  authenticating,
  authorizing(["driver"]),
  driverController.addCarInfoDriver
);
router.post(
  "/create-profile",
  authenticating,
  authorizing(["driver"]),
  driverController.createDriverProfile
);
router.get("/:driverId/cars", driverController.getProfileById);
module.exports = router;
