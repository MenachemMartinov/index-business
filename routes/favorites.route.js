const auth = require("../middlewares/auth.middleware");
const { User } = require("../models/user");

const router = require("express").Router();

/***
 * this route is to create new card the parameters what gibeon the id of the card what will to add to favorites
 */
router.get("/:id/new-favorites", auth, async (req, res) => {
  try {
    let favoritesFromDB = await User.findById(req.user._id);
    if (favoritesFromDB?.favorites.length > 0) {
      let favorites = favoritesFromDB?.favorites.find(
        (Favorites) => Favorites === req.params.id
      );
      if (favorites) {
        res.send({massage:"this id is exist"});
      } else {
        favoritesFromDB.favorites.push(req.params.id);
        favorites = await User.findOneAndUpdate(
          { _id: req.user._id },
          (favorites = favoritesFromDB)
        );
        res.send({massage:"the card add to favorites successfully"});
      }
    } else {
      favoritesFromDB.favorites.push(req.params.id);
      let favorites1 = await User.findOneAndUpdate(
        { _id: req.user._id },
        (favorites = favoritesFromDB)
      );
      res.send({massage:"the card add to favorites successfully"});
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/***
 * this route is to get all favorites
 */
router.get("/all-favorites", auth, async (req, res) => {
  try {
    const favorites = await User.findById(req.user._id);
    if (!favorites) {
      return res.status(404).send("no favorites");
    }
    res.send(favorites?.favorites);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

/***
 * this route is to get one favorite by id
 */
router.get("/:id", auth, async (req, res) => {
  const favorites = await User.findById(req.user._id);
  const findFavorites = favorites.favorites.find(
    (oneFavorites) => oneFavorites === req.params.id
  );
  if (!findFavorites) {
    return res.send({ massage: false });
  }
  res.send({ massage: true });
});

/***
 * this route is to delete one favorite by id
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    let favorites = await User.findById(req.user._id);
    favorites.favorites = favorites.favorites.filter(
      (item) => item !== req.params.id
    );

    favorites = await User.findOneAndUpdate({ _id: req.user._id }, favorites);
    res.send({massage:"the favorite card is deleted successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
