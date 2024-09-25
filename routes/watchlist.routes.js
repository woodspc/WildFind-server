const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Watch = require("../models/Watch.model");
const Specimen = require("../models/Specimen.model");
const Sightings = require("../models/Sighting.model");
const User = require("../models/User.model");

router.get("/watchlist", (req, res, next) => {
  Watch.find()
    .populate("sightings")
    .then((watches) => {
      res.status(200).json(watches);
    })
    .catch((err) => {
      next(err);
    });
});

//POST specific user's watchList array by using the userId in the request body
router.post("/watchlist/:userId", (req, res, next) => {
  const { specimenId, userId, note } = req.body;

  console.log("Note received:", note);

  // Validate the provided specimenId
  if (!mongoose.Types.ObjectId.isValid(specimenId)) {
    return res.status(400).json({ message: "Invalid specimen ID" });
  }

  // Find the specimen document by its ID
  Specimen.findById(specimenId)
    .then((specimen) => {
      if (!specimen) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Create a new Watch document with data from the Specimen document using .create()
      return Watch.create({
        specimenId,
        name: specimen.name,
        typeId: specimen.typeId,
        dangerLevel: specimen.dangerLevel,
        image: specimen.image,
        note: note,
        description: specimen.description,
        country: specimen.country,
        sightings: specimen.sightings, // assuming sightings is an array of ObjectId references
        userId,
      });
    })
    .then((createdWatch) => {
      //Create a new watch and push it to the correct user's watchList array. Doing the same as in sightings.
      return User.findByIdAndUpdate(
        userId,
        {
          $push: { watchList: createdWatch._id },
        },
        { new: true }
      );
    })
    .then((updatedUser) => res.status(201).json(updatedUser))
    .catch((err) => next(err));
});

//GET specific watch item
router.get("/watchlist/:watchId", (req, res, next) => {
  const { watchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(watchId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Watch.findById(watchId)
    .populate("sightings")
    .then((watch) => {
      res.status(200).json(watch);
    })
    .catch((err) => {
      next(err);
    });
});

//PUT specific watchlist item
router.put("/watchlist/:watchItemId", async (req, res, next) => {
  try {
    const { note } = req.body;
    const updatedWatchItem = await Watch.findByIdAndUpdate(
      req.params.watchItemId,
      { $set: { note: note || "" } }, // Add or update the note
      { new: true, upsert: true } // Upsert ensures a new document will be created if it doesn't exist
    );

    if (!updatedWatchItem) {
      return res.status(404).json({ message: "Watch item not found" });
    }

    res.status(200).json(updatedWatchItem);
  } catch (error) {
    next(error);
  }
});

//DELETE specific watchlist item
router.delete("/watchlist/:watchId", (req, res, next) => {
  const { watchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(watchId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Watch.findByIdAndDelete(watchId)
    .then((watch) => {
      res.json({
        message: `Watchlist item with id: ${watchId} was removed successfully.`,
      });
    })
    .catch((error) => res.json(error));
});

module.exports = router;
