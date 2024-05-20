const mongoose = require("mongoose");

const flightSchema = mongoose.Schema({
  flightNumber: String,
  notification: Boolean,
})

const tripsSchema = mongoose.Schema(
  {
    flight: flightSchema,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  },
  {
    timestamps: true,
  }
);

const Trips = mongoose.model("trips", tripsSchema);

module.exports = Trips;
