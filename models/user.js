const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");

/***
 * this is a schema for user
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  user: {
    type: Boolean,
    default: false,
  },
  business: {
    type: Boolean,
    default: false,
  },
  manager: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/***
 * this function generate the auth token
 */
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      user: this.user,
      business: this.business,
      manager: this.manager,
    },
    process.env.jwt_KEY
  );
  return token;
};

const User = mongoose.model("User", userSchema);

/***
 * this function is check if the data is valid
 */
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
    user: Joi.boolean(),
    business: Joi.boolean(),
    manager: Joi.boolean(),
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };
