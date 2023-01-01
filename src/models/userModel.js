const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema1 = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (mobile) {
          const result = /^((\+91)?|91)?[6789][0-9]{9}$/;
          return result.test(mobile);
        },
        message: "Please provide a valid mobile number",
      },
    },
    aadharNo: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (aadhar) {
          const result =
            /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/;
          return result.test(aadhar);
        },
        message: "Please provide a valid aadhar number",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 15,
    },
    pincode: {
      type: Number,
      required: true,
      validate: {
        validator: function (pincode) {
          const result = /^[1-9][0-9]{5}$/;
          return result.test(pincode);
        },
        message: "Please provide a valid pincode",
      },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    age: { type: Number, required: true, min: 12 },
    vaccinationStatus: {
      type: String,
      enum: ["none", "First dose completed", "All completed"],
      default: "none",
    },
  },
  { timestamps: true }
);

userSchema1.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);

  next();
});
userSchema1.methods.correctPassword = async function (
  givenPassword,
  savedPassword
) {
  return bcrypt.compare(givenPassword, savedPassword);
};

module.exports = new mongoose.model("vaccineUser", userSchema1);
