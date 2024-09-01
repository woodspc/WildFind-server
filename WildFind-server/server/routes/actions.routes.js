const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Sighting = require("../models/Sighting.model");
const Specimen = require("../models/Specimen.model");
const Actions = require("../models/Actions.model");

//GET all actions
router.get("/actions", (req, res, next) => {
  Actions.find()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => res.json(err));
});

//GET specific action by id
router.get("/actions/:actionId", (req, res, next) => {
  const { actionId } = req.params;

  Actions.findById(actionId)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
