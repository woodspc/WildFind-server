const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Sighting = require("../models/Sighting.model");
const Specimen = require("../models/Specimen.model");
const Actions = require("../models/Actions.model");

//GET all actions
router.get("/actions", (req, res, next) => {
  Actions.find()
    .populate("user")
    .populate({
      path: "comments",
      populate: { path: "userId" },
    })
    .populate({
      path: "sighting",
      populate: [
        {
          path: "country",
          select: "name",
        },
        {
          path: "district",
          select: "name",
        },
        {
          path: "placeOfInterest",
          select: "name",
        },
        { path: "specimenId" },
      ],
    })
    .populate("addition")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => res.json(err));
});

//GET specific action by id
router.get("/actions/:actionId", (req, res, next) => {
  const { actionId } = req.params;

  Actions.findById(actionId)
    .populate("user")
    .populate("sighting")
    .populate("additions")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
