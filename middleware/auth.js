const jwt = require("jsonwebtoken");

const authenticating = (req, res, next) => {
  // verify token
  //     - thanh cong: return next();
  //     -   that bai: res.json(err);

  const token = req.header("Authorization");
  const fingerprint = req.header("fingerprint");
  const KEY = process.env.SECRET_KEY + fingerprint;
  try {
    const decoded = jwt.verify(token, KEY);
    // console.log("TCl: authenticating", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ errors: "Ban khong the xem. Token or fingerprint khonh hop le" });
  }
};

// User: passenger, driver, admin
const authorizing = userTypeArray => {
  return (req, res, next) => {
    console.log(req.user);
    const { userType } = req.user;
    console.log("TCL: authorizing -> userType", userType);
    // userTypeArray: danh sach cac loai nguoi dung co the truy cap
    // userType: loai nguoi dung hien tai (lay tu decoded cua token)
    // neu userTypeArray co chua userType ==> next

    if (userTypeArray.indexOf(userType) > -1) {
      return next();
    } else {
      res
        .status(403)
        .json({ errors: "Ban da dang nhap. nhung khong co quyen vao" });
    }
  };
};

module.exports = {
  authenticating,
  authorizing
};
