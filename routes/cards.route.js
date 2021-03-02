const c = require("config");
const auth = require("../middlewares/auth.middleware");
const { validateCard, Card, generateBizNumber } = require("../models/card");

const router = require("express").Router();

router.post("/new-card", auth, async (req, res) => {
  const { error } = validateCard(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let card = await new Card({
    ...req.body,
    bizNumber: await generateBizNumber(),
    user_id: req.user._id,
  });

  await card.save();
  console.log(card);
  res.send(card);
});

router.get("/all-cards", async (req, res) => {
  const cards = await Card.find();
  if (!cards) {
    return res.status(404).send("not find cards");
  }
  res.send(cards);
});

router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).send("card with given id not found");
    }
    res.send(card);
  } catch (err) {
    console.error("error from get card by id", err);
    res.send("not found card with the id");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = validateCard(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const card = await Card.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user._id,
      },
      req.body
    );
    if (!card) {
      return res.status(400).send("card not found");
    }

    card = await Card.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    res.send(card);
  } catch (err) {
    console.error("error from update card by _id", err);
    res.status(403).send(err);
  }
});

router.put("/:id/upload-img", auth, async (req, res) => {
  try {
    let card = await Card.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user._id,
      },
      {
        $push: {
          ...req.body,
        },
      }
    );
    if (!card) {
      return res.status(400).send("card not found");
    }

    card = await Card.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    res.send(card);
  } catch (err) {
    console.error("error from update card by _id upload img", err);
    res.status(500).send(err);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { error } = validateCard(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const card = await Card.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });
    if (!card) {
      return res.status(400).send("card not found");
    }
    res.send(card);
  } catch (err) {
    console.error("error from update card by _id", err);
    res.status(403).send(err);
  }
});

module.exports = router;
