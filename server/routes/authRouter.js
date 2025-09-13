const { Router } = require("express");
const router = Router();
const { body } = require("express-validator");
const LoginController = require("../controllers/LoginController");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");

router.post(
  "/register",
  [
    body("username")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address."),
  ],
  LoginController.register
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  LoginController.login
);

router.post("/logout", LoginController.logout);

router.get("/user-details", authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("username email"); 

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with user details
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
