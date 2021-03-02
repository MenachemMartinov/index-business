const mongoose = require("mongoose");

const Joi = require("@hapi/joi");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(category) {
  const schema = Joi.object({
    categoryName: Joi.string().required().min(2).max(50),
    image: Joi.string(),
  });

  return schema.validate(category);
}

module.exports = { Category, validateCategory };
