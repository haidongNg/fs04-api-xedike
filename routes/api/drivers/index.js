const express = require("express");
const router = express.Router();
const { authenticating, authorizing } = require("../../../middleware/auth");
const driverController = require("./drivers");
const upload = require("../../../middleware/uploadImage");

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
router.put(
  "/update-profile",
  authenticating,
  authorizing(["driver"]),
  driverController.updateDriverProfile
);
router.post(
  "/upload-car/:carId",
  authenticating,
  upload.single("carImage"),
  authorizing(["driver"]),
  driverController.uploadCarImage
);
router.get("/:driverId/cars", driverController.getProfileCarById);

module.exports = router;
