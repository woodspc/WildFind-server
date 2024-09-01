const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Comment = require("../models/Comment.model");
const Actions = require("../models/Actions.model");

router.post("/comments", (req, res, next) => {
  const { userId, actionId, text } = req.body;

  Comment.create({
    userId,
    actionId,
    text,
  })
    .then((newComment) => {
      return Actions.findByIdAndUpdate(
        actionId,
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      ).then((newComment) => {
        res.status(201).json(newComment);
      });
    })
    .catch((error) => {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Error creating comment" });
    });
});

router.get("/comments", (req, res, next) => {
  Comment.find()
    .populate("userId")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
