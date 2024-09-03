const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Message = require("../models/Message.model");
const User = require("../models/User.model");

//Post a new message between 2 specific users
router.post("/messages/:targetedUserId", (req, res, next) => {
  const { sender, text } = req.body; //currently logged in userId
  const { targetedUserId } = req.params; //Id of the user that will receive the message

  Message.create({
    sender,
    receiver: targetedUserId,
    text,
  })
    .then((newMessage) => {
      //add message to sender's sentMessages array
      return User.findByIdAndUpdate(
        sender,
        {
          $push: { sentMessages: newMessage._id },
        },
        { new: true }
      ).then(() => newMessage);
    })
    //add message to receiver's receivedMessages array
    .then((newMessage) => {
      return User.findByIdAndUpdate(
        targetedUserId,
        {
          $push: { receivedMessages: newMessage._id },
        },
        { new: true }
      ).then(() => newMessage);
    })
    .then((newMessage) => res.json(newMessage))
    .catch((err) => res.json(err));
});

module.exports = router;
