const authMiddleware = require("../middlewares/auth.middleware");
const { Card } = require("../models/card");
const {
  validateMessage,
  Message,
  generateMessageNumber,
} = require("../models/messages");

const router = require("express").Router();

router.post("/:id/new-message", authMiddleware, async (req, res) => {
  const { error } = validateMessage(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
  }

  try {
    let card = await Card.findById(req.params.id);

    if (!card) {
      res.status(400).send("card not found");
    }

    let message = await new Message({
      ...req.body,
      messageNumber: await generateMessageNumber(),
      user_id: req.user._id,
      of_card: req.params.id,
    });

    await message.save();

    card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { bizMessages: message._id } }
    );
    res.send(message);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
