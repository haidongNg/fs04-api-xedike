const express = require("express");
const { authenticating, authorizing } = require("../../../middleware/auth");
const tripController = require("./trips");

const router = express.Router();

// trip
router.get("/:tripId", tripController.getTrip);

router.delete(
  "/:tripId",
  authenticating,
  authorizing(["driver"]),
  tripController.deleteTrip
);

router.put(
  "/:tripId",
  authenticating,
  authorizing(["driver"]),
  tripController.updateTrip
);
router.post(
  "/create-trip",
  authenticating,
  authorizing(["driver"]),
  tripController.createTrip
);

// book-trip
router.post(
  "/book/:tripId",
  authenticating,
  authorizing(["passenger"]),
  tripController.bookTrip
);

router.put(
  "/cancel/:tripId",
  authenticating,
  authorizing(["passenger"]),
  tripController.cancelBookTrip
);

router.put(
  "/finish/:tripId",
  authenticating,
  authorizing(["driver"]),
  tripController.finishTheTrip
);

router.put(
  "/rates/:tripId",
  authenticating,
  authorizing(["passenger"]),
  tripController.ratesTrip
);
router.get("/", tripController.getAllTrip);
module.exports = router;
