const auth = require("../middlewares/auth.middleware");
const { Favorites, validateFavorites } = require("../models/favorites");

const router = require("express").Router();

router.post("/new-favorites", auth, async (req, res) => {
  const { error } = validateFavorites(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let favorites = await new Favorites({
    ...req.body,
    user_id: req.user._id,
  });

  await favorites.save();
  res.send(Favorites);
});

router.get("/", async (req, res) => {
  const favorites = await Favorites.find();
  if (!favorites) {
    return res.status(404).send("no favorites");
  }
  res.send(favorites);
});

router.delete("/:id",auth, async (req, res) => {
  const favorites = await Favorites.findOneAndDelete({
    
  });
  if (!favorites) {
    return res.status(404).send("no favorites");
  }
  res.send(favorites);
});

module.exports = router;
