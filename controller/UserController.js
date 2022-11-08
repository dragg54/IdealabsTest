const { sqlConnection } = require("../db/dbconnection");
const UserClass = require("../db/models/User");
const bcrypt = require("bcrypt");
const {
  validateUserInput,
  duplicateUserChecker,
} = require("../Helpers/ValidateInputs");
const confirmPermission = require("../Helpers/Permission");
const jwt = require("jsonwebtoken");

//create user record
exports.createUser = (req, res) => {
let { name, email, password, phone, roleId } = req.body;
  let fieldError = validateUserInput(name, email, password, phone, roleId);
  const permission = "create user";
  confirmPermission(req, permission)
  .then(()=>{
    sqlConnection.query("select * from user", (err, rows, fields) => {
      if (fieldError === null) {
        const response = JSON.stringify(rows[0]);
        if (rows.length > 0 && JSON.parse(response).email === email) {
          return res.status(409).send("user already exists");
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              password = hash;
              const User = new UserClass(name, email, phone, password, roleId);
              User.create(req, res);
              const sql = `INSERT INTO user(name, email, phone, password, role_id) VALUES("${User.name}", "${User.email}", "${User.phone}", "${User.password}", ${User.roleId})`;
              sqlConnection.query(sql, (err, rows, fields) => {
                if (!err) {
                  return res.status(201).send(User);
                } else {
                  return res.status(500).send(err);
                }
              });
            });
          });
        }
      } else {
        res.send(fieldError);
      }
    })
  }).catch((err)=>{
    res.status(401).send(err)
  })
      };

//get all users records
exports.getAllUserRecord = (req, res) => {
  const permission = "get user"
  confirmPermission(req, permission)
    .then(() => {
      const sql = `SELECT * FROM user`;
      sqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
          res.status(302).send(rows);
        }
      });
    })
    .catch((err) => {
      res
        .status(401)
        .send(err);
    }).catch((err)=>{
      res.status(409).send(err)
    })
};

//get a user record
exports.getUserRecord = (req, res) => {
  const userId = req.params.id;
  const permission = "get user"
  confirmPermission(res, req, permission)
  .then(()=>{

     const sql = `SELECT * FROM user WHERE user_id = ${userId}`;
     sqlConnection.query(sql, (err, rows, fields) => {
       if (!err && rows.length > 0) res.status(302).send(rows);
       else {
         res.status(400).send("role not found");
       }
     });
  }).catch((err)=>{
    res.status(401).send(err)
})
 
};

//delete user record
exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  const permission = "delete user"
  confirmPermission(req, permission)
    .then(() => {
      const sql = `DELETE FROM user WHERE user_id= ${userId}`;
      sqlConnection.query(sql, (err, rows, fields) => {
        if (!err) {
          res.status(200).send(`User with id ${userId} deleted`);
        }
      });
    })
    .catch((err) => {
      res.status(401).send(err)
  });
};

exports.updateUser = (req, res) => {
  let { name, email, password, phone, roleId } = req.body;
  const permission = "update user"
  confirmPermission(req, permission)
    .then(() => {
      const sql = `UPDATE user SET name = "${name}", email= "${email}", password = "${password}", phone = "${phone}", role_id = ${roleId} WHERE group_id = ${groupId}`;
      sqlConnection.query(sql, (err, rows, fields) => {
        if (!err) res.status(200).send("group updated");
        else {
          res.status(400).send(err);
        }
      });
    }).catch((err) => {
      res.status(401).send(err);
    });
 
};

//user login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  sqlConnection.query(
    `SELECT * FROM user WHERE email = "${email}"`,
    (err, rows, fields) => {
      console.log(rows)
      const response = JSON.stringify(rows[0])
      bcrypt.compare(password, JSON.parse(response).password, (err, isMatch) => {
        if (err) res.send(err);
        if (isMatch) {
          const accessToken = jwt.sign(
            { userId: rows[0].user_id, roleId: rows[0].role_id },
            process.env.SECRET_TOKEN
          );
          /*  res.cookie("auth_token", accessToken, {
              secure: true,
              sameSite: "none",
            }); */
          res.header("auth_token", accessToken).send(accessToken);
        }
      });
    }
  );
};
