const mongoose = require("mongoose");

const Joi = require("@hapi/joi");

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

function validateFavorites(favorites) {
  const schema = Joi.object({
    favoritesName: Joi.string().required().min(2).max(50),
  });

  return schema.validate(favorites);
}

module.exports = { Favorites, validateFavorites };
