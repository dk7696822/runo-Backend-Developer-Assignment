const mongoose = require("mongoose");
const moment = require("moment");

const vaccineSchema = new mongoose.Schema(
  {
    date: { type: String, default: `${moment().format("Do")} of January` },
    slot1: { type: [String] },
    slot2: { type: [String] },
    slot3: { type: [String] },
    slot4: { type: [String] },
    slot5: { type: [String] },
    slot6: { type: [String] },
    slot7: { type: [String] },
    slot8: { type: [String] },
    slot9: { type: [String] },
    slot10: { type: [String] },
    slot11: { type: [String] },
    slot12: { type: [String] },
    slot13: { type: [String] },
    slot14: { type: [String] },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Vaccine", vaccineSchema);
