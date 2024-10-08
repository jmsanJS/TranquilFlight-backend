const mongoose = require("mongoose");

const flightSchema = mongoose.Schema({
  flightData: Object,
  notification: Boolean,
});

const favoriteSchema = mongoose.Schema(
  {
    flights: [flightSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  }
);

const Favorites = mongoose.model("favorite", favoriteSchema);

module.exports = Favorites;
