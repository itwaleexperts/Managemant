const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}_${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("only jpeg, jpg, png and webp images are uploads"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, 
});

const uploadImagesMiddleware = (req, res, next) => {
  upload.array("images", 5)(req, res, (err) => {
    if (err) {
      let errorMsg = err.message;
      if (err.code === "LIMIT_FILE_SIZE") {
        errorMsg = "every image are 5 mb only";
      } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
        errorMsg = "5 iamges only uplaods";
      }
      return res.status(400).json({
        success: false,
        message: "image upload faild",
        error: errorMsg,
      });
    }

    if (!req.files) req.files = [];

    console.log("Uploaded files:", req.files);

    next();
  });
};

module.exports = uploadImagesMiddleware;