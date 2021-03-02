const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const authMiddleware = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.get("/user-details", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/new-user", async (req, res) => {
  console.log(req.body);
  const { error } = validateUser(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("email is exist chaise a oder email");
    }

    user = await new User(req.body);

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();
    res.send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body);
  if (!user) {
    return res.status(400).send("email is exist chaise a oder email");
  }

  user = await User.findOne({ _id: req.params.id });
  res.send(user);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const user = await User.findOneAndRemove({ _id: req.params.id });
  if (!user) {
    return res.status(400).send("the user with given ID is not found");
  }
  res.send(user);
});

module.exports = router;
