const express = require("express");
const { authenticating, authorizing } = require("../../../middleware/auth");
const tripController = require("./trips");

const router = express.Router();

// trip


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

router.post(
  "/cancel/:tripId",
  authenticating,
  authorizing(["passenger"]),
  tripController.cancelBookTrip
);

router.patch(
  "/finish/:tripId",
  authenticating,
  authorizing(["driver"]),
  tripController.finishTheTrip
);

router.post(
  "/rates/:tripId",
  authenticating,
  authorizing(["passenger"]),
  tripController.ratesTrip
);
router.delete(
  "/:tripId",
  authenticating,
  authorizing(["driver"]),
  tripController.deleteTrip
);

router.get("/:tripId", tripController.getTrip);
router.get("/", tripController.getTrips);
module.exports = router;
