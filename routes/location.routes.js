const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Specimen = require("../models/Specimen.model");
const Country = require("../models/Country.model");
const District = require("../models/District.model");
const PlaceOfInterest = require("../models/PlaceOfInterest.model");

//CREATE a country
router.post("/countries", (req, res, next) => {
  const { name, districts, placesOfInterest, sightings } = req.body;

  Country.create({
    name,
    districts,
    placesOfInterest,
    sightings,
  })
    .then((country) => {
      res.status(201).json(country);
    })
    .catch((error) => {
      console.log(error);
    });
});

//GET all countries
router.get("/countries", (req, res, next) => {
  Country.find()
    .populate({
      path: "districts",
      select: "name",
    })
    .populate("placesOfInterest")
    .populate("sightings")
    .then((countries) => {
      res.status(200).json(countries);
    })
    .catch((error) => {
      console.log(error);
    });
});

//CREATE a district and push it to its country
router.post("/districts", (req, res, next) => {
  const { name, country, placesOfInterest, sightings } = req.body;

  District.create({
    name,
    country,
    placesOfInterest,
    sightings,
  })
    .then((district) => {
      return Country.findByIdAndUpdate(
        country,
        {
          $push: { districts: district._id },
        },
        { new: true }
      ).then(() => district);
    })
    .then((district) => {
      res.status(201).json(district);
    })
    .catch((error) => {
      console.log(error);
    });
});

//GET all districts
router.get("/districts", (req, res, next) => {
  District.find()
    .populate({
      path: "country",
      select: "name",
    })
    .populate("placesOfInterest")
    .populate("sightings")
    .then((districts) => {
      res.status(200).json(districts);
    })
    .catch((error) => {
      console.log(error);
    });
});

//GET specific district by the name
router.get("/districts/:district", (req, res, next) => {
  const { district } = req.params;

  District.findOne({ name: district })
    .populate("placesOfInterest")
    .populate("sightings")
    .then((district) => {
      if (!district) {
        return res.status(404).json({ message: "District not found" });
      }
      res.status(200).json(district);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    });
});

//places of interest routes

//CREATE a place of interest and add it to a district
router.post("/places-of-interest", (req, res, next) => {
  const {
    name,
    description,
    country,
    district,
    billboard,
    sightings,
    coordinates,
  } = req.body;

  PlaceOfInterest.create({
    name,
    description,
    country,
    district,
    billboard,
    sightings,
    coordinates,
  })
    .then((place) => {
      return District.findByIdAndUpdate(
        district,
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

//GET all places of interest
router.get("/places-of-interest", (req, res, next) => {
  PlaceOfInterest.find()
    .populate({
      path: "country",
      select: "name",
    })
    .populate({
      path: "district",
      select: "name",
    })
    .populate("sightings")
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

  PlaceOfInterest.findById(placeOfInterestId)
    .populate({
      path: "country",
      select: "name",
    })
    .populate({
      path: "district",
      select: "name",
    })
    .then((place) => {
      res.status(200).json(place);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
