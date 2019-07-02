const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    let type = "";
    //kiem tra file
    if (file.mimetype === "application/octet-steam" || !file.mimetype)
      type = ".jpg";
    //
    cb(null, Date.now() + "-" + file.originalname + type);
  }
});

const upload = multer({ storage });

module.exports = upload;
