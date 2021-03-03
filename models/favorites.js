const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
  favoritesName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Favorites = mongoose.model("Favorites", favoritesSchema);

module.exports = { Favorites };
