const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the header

  if (!token) {
    return res.status(401).json({ message: "No token provided!" });
  }

  // Decode the token to get the user info
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter

    // Check if the decoded user ID matches the requested user ID
    if (decodedToken._id !== userId) {
      return res.status(403).json({ message: "Unauthorized!" });
    }

    // Add the user data to the request object for further use
    req.user = decodedToken;

    next();
  });
};

module.exports = verifyUser;
