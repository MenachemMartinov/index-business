const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const fs = require("fs");
const router = require("express").Router();

const filePath = "upload";
if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${new Date().toISOString().replace(/:/g, "-")}-${originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

const type = upload.single("file");

router.post("/new-file", authMiddleware, type, (req, res) => {
  try {
    if (req.file) {
      return res.json({ status: "you or good", path: req.file.path });
    }
    return res.status(403).send("error");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
