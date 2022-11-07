const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth_token")
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
      if (err) return res.status(403).send(err);
      req.user = user;
      console.log(req.user.roleId)
      next();
    });
  } else {
    res.status(400).send("you are not logged in")
  }
};


