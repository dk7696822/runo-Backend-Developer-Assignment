const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const ErrorHandler = require("../errorHandler/errorHandlingClass");
const VaccineSlots = require("../models/vaccine");

exports.adminLogin = async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return next(
      new ErrorHandler(400, "Please provide phoneNumber and password")
    );
  }

  const user = await User.findOne({ phoneNumber });
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorHandler(401, "Incorrect email or password"));
  }
  const token = jwt.sign({ userId: user._id }, "ultra-strong-password", {
    expiresIn: "10h",
  });
  return res.status(200).send({
    message: "login successful, welcome admin",
    token,
  });
};

exports.getRegisteredUsers = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (user.role != "admin") {
    return next(
      new ErrorHandler(403, "You are not authorised to perform this action...")
    );
  }

  const users = await User.find(req.query);
  if (users.length === 0) {
    return next(new ErrorHandler(404, "No users matched this filter"));
  }
  res.status(200).send({ status: true, data: users });
};

exports.checkRegisteredSlots = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (user.role != "admin") {
    return next(
      new ErrorHandler(403, "You are not authorised to perform this action...")
    );
  }
  const vaccineSlots = await VaccineSlots.findOne({
    date: `${moment().format("Do")} of January`,
  });
  return res.status(200).send({ slots: vaccineSlots });
};
