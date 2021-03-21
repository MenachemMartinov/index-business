const auth = require("../middlewares/auth.middleware");
const { validateCategory, Category } = require("../models/category");

const router = require("express").Router();

/***
 * this route is create new category
 */
router.post("/new-category", auth, async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let category = await new Category({
    ...req.body,
    user_id: req.user._id,
  });

  await category.save();
  res.send(category);
});

/***
 * this route is to get all categories
 */
router.get("/", async (req, res) => {
  const category = await Category.find();
  if (!category) {
    return res.status(404).send("no categories");
  }
  res.send(category);
});

module.exports = router;
