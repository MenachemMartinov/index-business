const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const _ = require("lodash");


/***
 * this the schema of card
 */
const cardSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  bizDescription: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  bizCategory: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  bizAddress: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 400,
  },
  bizPhone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  bizImage: {
    type: [String],
    default: [],
  },
  bizImageDefault: {
    type: [String],
    default: null,
  },
  bizImageWeek: {
    type: [String],
    default: null,
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 9999999999999,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bizMessages: {
    type: [String],
    default: [],
  },
});

const Card = mongoose.model("Card", cardSchema);

/***
 * this generate biz number
 */
async function generateBizNumber() {
  while (true) {
    let randomNumber = _.random(1000, 9999999999999);
    let card = await Card.findOne({ bizNumber: randomNumber });

    if (!card) {
      return String(randomNumber);
    }
  }
}

/***
 * this a function that check if what the frontend send is valid
 */
function validateCard(card) {
  const schema = Joi.object({
    bizName: Joi.string().min(2).max(255).required(),
    bizDescription: Joi.string().min(2).max(1024).required(),
    bizAddress: Joi.string().min(2).max(400).required(),
    bizCategory: Joi.string().min(2).max(50).required(),
    bizPhone: Joi.string().min(9).max(10).required(),
    bizImage: Joi.array(),
    bizImageDefault: Joi.array(),
    bizImageWeek: Joi.array(),
  });

  return schema.validate(card);
}

module.exports = {
  Card,
  validateCard,
  generateBizNumber,
};
