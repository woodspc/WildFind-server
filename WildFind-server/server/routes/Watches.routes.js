const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Watch = require("../models/Watch.model");
const Specimen = require("../models/Specimen.model");

router.get("/watchlist", (req, res, next) => {
  Watch.find()
    // .populate("specimens")
    .then((watches) => {
      res.status(200).json(watches);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/watchlist", (req, res, next) => {
  const { specimenId } = req.body;

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
        description: specimen.description,
        location: specimen.location,
        sightings: specimen.sightings, // assuming sightings is an array of ObjectId references
      });
    })
    .then((watch) => res.status(201).json(watch))
    .catch((err) => next(err));
});

router.get("/watchlist/:watchId", (req, res, next) => {
  const { watchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(watchId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Watch.findById(watchId)
    .then((watch) => {
      res.status(200).json(watch);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
