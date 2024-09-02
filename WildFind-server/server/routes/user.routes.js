const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

router.get("/users", (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/users/:userId", (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .populate("sightings")
    .populate("watchList")

    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/users");

module.exports = router;
