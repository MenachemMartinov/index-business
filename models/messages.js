const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const _ = require("lodash");

const messageSchema = new mongoose.Schema({
  messageStar: {
    type: Number,
  },
  messageDescription: {
    type: String,
    minlength: 2,
    maxlength: 1024,
  },
  messageNumber: {
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
  of_card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
  },
});

const Message = mongoose.model("Message", messageSchema);

async function generateMessageNumber() {
  while (true) {
    let randomNumber = _.random(1000, 9999999999999);
    let message = await Message.findOne({ messageNumber: randomNumber });

    if (!message) {
      return String(randomNumber);
    }
  }
}

function validateMessage(message) {
  const schema = Joi.object({
    messageStar: Joi.number(),
    messageDescription: Joi.string().min(2).max(1024),
    messageImage: Joi.array(),
  });

  return schema.validate(message);
}

module.exports = {
  Message,
  validateMessage,
  generateMessageNumber,
};
