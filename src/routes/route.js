const express = require("express");

const {
  authentication,
  authorization,
} = require("../controllers/authController");
const { registerUser, login } = require("../controllers/userController");
const {
  bookSlot,
  createSlot,
  updateSlot,
} = require("../controllers/vaccineController");
const {
  adminLogin,
  getRegisteredUsers,
  checkRegisteredSlots,
} = require("../controllers/adminController");
const router = express.Router();

const use = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
router.post("/register", use(registerUser));
router.post("/login", use(login));
router.post("/bookSlot/:userId", authentication, authorization, use(bookSlot));
router.post(
  "/create-slot/:userId",
  authentication,
  authorization,
  use(createSlot)
);
router.post(
  "/update-slot/:userId",
  authentication,
  authorization,
  use(updateSlot)
);
router.get(
  "/users/:userId",
  authentication,
  authorization,
  use(getRegisteredUsers)
);
router.get(
  "/slots/:userId",
  authentication,
  authorization,
  use(checkRegisteredSlots)
);
router.post("/admin-login", use(adminLogin));
module.exports = router;
