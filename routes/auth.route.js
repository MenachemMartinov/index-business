const { User } = require("../models/user");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const router = require("express").Router();

/***
 * this is route for auth (login)
 */
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("User is not found");
    }
    // validate password
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(user.password);
    console.log(isValidPassword);
    if (!isValidPassword) {
      return res.status(400).send("Invalid email or password");
    }

    res.send({
      token: user.generateAuthToken(),
      user: _.pick(user, ["_id", "name", "email"]),
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/***
 * this function check if the data is valid
 */
function validate(data) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(data);
}

module.exports = router;
