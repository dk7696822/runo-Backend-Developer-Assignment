const User = require("../models/userModel");
const ErrorHandler = require("../errorHandler/errorHandlingClass");
const jwt = require("jsonwebtoken");
const moment = require("moment");

exports.registerUser = async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).send({
    status: "success",
    message: "You are successfully registered",
    data: user,
  });
};

exports.login = async (req, res, next) => {
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

  const slotsAvailable = [];
  let date = moment().set({ hour: 10, minute: 00 });
  let time = moment(date).format("hh:mm");

  for (let i = 1; i < 15; i++) {
    slotsAvailable.push(
      `select slot${i} to book slot between ${time} - ${moment(date)
        .add(30, "minutes")
        .format("hh:mm")}`
    );
    date = moment().set({ hour: date.hour(), minute: date.minute() + 30 });
    time = moment(date).format("hh:mm");
  }
  return res.status(200).send({
    message: "Following are the time slots for vaccination",
    token,
    slotsAvailable,
  });
};
