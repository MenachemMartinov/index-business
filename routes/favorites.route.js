const auth = require("../middlewares/auth.middleware");
const { Favorites } = require("../models/favorites");

const router = require("express").Router();

router.post("/:id/new-favorites", auth, async (req, res) => {
  try {
    let favorites = await new Favorites({
      user_id: req.user._id,
      of_card: req.params.id,
    });

    await favorites.save();
    res.send(favorites);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/all-favorites", auth, async (req, res) => {
  const favorites = await Favorites.find({
    user_id: req.user._id,
  });
  if (!favorites) {
    return res.status(404).send("no favorites");
  }
  res.send(favorites);
});

router.get("/:id", auth, async (req, res) => {
  const favorites = await Favorites.find({
    user_id: req.user._id,
    of_card: req.params.id,
  });
  if (!favorites) {
    return res.send(null);
  }
  res.send(favorites);
});

router.delete("/:id", auth, async (req, res) => {
  const favorites = await Favorites.findOneAndDelete({
    user_id: req.user._id,
    of_card: req.params.id,
  });
  if (!favorites) {
    return res.status(404).send("no favorites");
  }
  res.send(favorites);
});

module.exports = router;
