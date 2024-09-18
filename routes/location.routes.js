const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Location = require("../models/Location.model");
const PlacesOfInterest = require("../models/PlacesOfInterest.model");
const Specimen = require("../models/Specimen.model");

//GET all locations
router.get("/locations", (req, res, next) => {
  Location.find()
    .populate("placesOfInterest")
    .then((locations) => {
      res.status(200).json(locations);
    })
    .catch((error) => {
      console.log(error);
    });
});

//GET specific location by Id
router.get("/locations/:locationId", (req, res, next) => {
  const { locationId } = req.params;

  Location.findById({ locationId })
    .populate("placesOfInterest")
    .then((location) => {
      res.status(200).json(location);
    })
    .catch((error) => {
      console.log(error);
    });
});

//CREATE a location
router.post("/locations", (req, res, next) => {
  const { name, country } = req.body;

  Location.create({ name, country })
    .then((location) => {
      res.status(201).json(location);
    })
    .catch((error) => {
      console.log(error);
    });
});

//places of interest routes
//GET all places of interest
router.get("/places-of-interest", (req, res, next) => {
  PlacesOfInterest.find()
    .populate("location")
    .populate("identifiedSpecies")
    .then((places) => {
      res.status(200).json(places);
    })
    .catch((error) => {
      console.log(error);
    });
});

//GET specific place of interest by Id
router.get("/places-of-interest/:placeOfInterestId", (req, res, next) => {
  const { placeOfInterestId } = req.params;

  PlacesOfInterest.findById({ placeOfInterestId })
    .populate("location")
    .populate("identifiedSpecies")
    .then((location) => {
      res.status(200).json(location);
    })
    .catch((error) => {
      console.log(error);
    });
});

//CREATE a place of interest
router.post("/places-of-interest", (req, res, next) => {
  const {
    name,
    description,
    location,
    billboard,
    identifiedSpecies,
    coordinates,
  } = req.body;

  PlacesOfInterest.create({
    name,
    description,
    location,
    billboard,
    identifiedSpecies,
    coordinates,
  })
    .then((place) => {
      return Location.findByIdAndUpdate(
        location,
        {
          $push: { placesOfInterest: place._id },
        },
        { new: true }
      ).then(() => place);
    })
    .then((place) => {
      res.status(201).json(place);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
