const auth = require("../middlewares/auth.middleware");
const { validateCategory, Category } = require("../models/category");

const router = require("express").Router();

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

router.get("/", async (req, res) => {
  const category = await Category.find();
  if (!category) {
    return res.status(404).send("no categories");
  }
  res.send(category);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).send("no category");
  }
  res.send(category);
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    if (!category) {
      return res.status(404).send("no category");
    }

    console.log(category);
    let updateCategory = await Category.findById(category._id);

    res.send(updateCategory);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  const category = await Category.findOneAndRemove({ _id: req.params.id });
  if (!category) {
    return res.status(404).send("no category");
  }

  res.send(category);
});

module.exports = router;
