const VaccineSlot = require("../models/vaccine");
const User = require("../models/userModel");
const ErrorHandler = require("../errorHandler/errorHandlingClass");
const moment = require("moment");

exports.createSlot = async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  //Only Admin can create slots//
  if (user.role === "admin") {
    for (let i = 0; i < 31; i++) {
      console.log(moment().add(i, "days").format("Do"));
      req.body.date = `${moment().add(i, "days").format("Do")} of January`;
      await VaccineSlot.create(req.body);
    }
    return res.status(201).send({ message: "slots created" });
  }
  return res
    .status(403)
    .send({ message: "You are not authorised to create slots" });
};

exports.bookSlot = async (req, res, next) => {
  //User can book slot on a given day
  const user = await User.findById(req.params.userId);
  const check = await VaccineSlot.findOne({
    date: `${moment().format("Do")} of January`,
  });
  if (!check) {
    return next(new ErrorHandler(404, "No slots found"));
  }
  for (let i = 1; i < 15; i++) {
    if (check[`slot${i}`].includes(req.params.userId)) {
      return next(new ErrorHandler(400, "You are already registered"));
    }
  }
  const { slot, dose } = req.body;
  if (!slot || !dose) {
    return next(
      new ErrorHandler(400, "Please provide both slot and dose of vaccination")
    );
  }

  let num = slot.replace(/\D/g, "");
  const slotsAvailable = [];
  let date = moment().set({ hour: 10, minute: 00 });
  let time = moment(date).format("hh:mm");
  num = Number(num) + 1;
  for (let i = 1; i < num; i++) {
    slotsAvailable.push(
      `${time} - ${moment(date).add(30, "minutes").format("hh:mm")}`
    );
    date = moment().set({ hour: date.hour(), minute: date.minute() + 30 });
    time = moment(date).format("hh:mm");
  }
  const match = slotsAvailable.find((el) => {
    if (el.includes(moment().add(30, "minutes").format("hh"))) {
      return true;
    }
  });
  if (match == undefined) {
    return res.status(400).send({
      message:
        "This time slot is already passed, choose another time, or book for same time slot on next day",
    });
  }

  if (dose == "1") {
    if (check[`${slot}`].length === 10) {
      return res
        .status(404)
        .send("This slot is not available, please book another slot");
    }
    check[`${slot}`].push(req.params.userId);
    await VaccineSlot.findOneAndUpdate(
      { date: `${moment().format("Do")} of January` },
      { $set: check }
    );
    await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: { vaccinationStatus: "First dose completed" } },
      { runValidators: true }
    );
    return res
      .status(200)
      .send({ message: `You are registered for vaccination for ${slot}` });
  }
};

exports.updateSlot = async (req, res, next) => {
  //user can update slot for the given day
  const { slot } = req.body;
  if (!slot) {
    return next(
      new ErrorHandler(400, "Please mention the slot you want to update to")
    );
  }
  const num = slot.replace(/\D/g, "");
  const slotsAvailable = [];
  let date = moment().set({ hour: 10, minute: 00 });
  let time = moment(date).format("hh:mm");

  for (let i = 1; i < Number(num) + 1; i++) {
    slotsAvailable.push(
      `${time} - ${moment(date).add(30, "minutes").format("hh:mm")}`
    );
    date = moment().set({ hour: date.hour(), minute: date.minute() + 30 });
    time = moment(date).format("hh:mm");
  }

  const match = slotsAvailable.find((el) => {
    if (el.includes(moment().add(30, "minutes").format("hh"))) {
      return true;
    }
  });
  if (match == undefined) {
    return res.status(400).send({
      message:
        "This time slot is already passed, choose another time, or book for same time slot on next day",
    });
  }
  const vaccine = await VaccineSlot.findOne({
    date: `${moment().format("Do")} of January`,
  });
  for (let i = 1; i < 15; i++) {
    if (vaccine[`slot${i}`].includes(req.params.userId)) {
      vaccine[`slot${i}`].length = 0;
      await VaccineSlot.findOneAndUpdate(
        { date: `${moment().format("Do")} of January` },
        { $set: vaccine }
      );
    }
  }
  vaccine[`${slot}`].push(req.params.userId);

  await VaccineSlot.findOneAndUpdate(
    { date: `${moment().format("Do")} of January` },
    { $set: vaccine }
  );
  return res
    .status(200)
    .send({ message: `You have successfully booked ${slot}` });
};
