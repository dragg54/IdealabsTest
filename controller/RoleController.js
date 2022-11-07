const { sqlConnection } = require("../db/dbconnection");
const { validateRoleInput } = require("../Helpers/ValidateInputs");
const { duplicateRoleChecker } = require("../Helpers/DuplicateCheckers");
const confirmPermission = require("../Helpers/Permission");

exports.createRole = (req, res) => {
  const { roleName, userId } = req.body;
  const permission = "create role";
  const fieldError = validateRoleInput(roleName);
  if (fieldError === null) {
    confirmPermission(req.user.roleId, permission).then(() => {
      duplicateRoleChecker(roleName)
        .then(() => {
          const sql = `INSERT INTO role(role_name, user_id) values("${roleName}", "${userId}")`;
          sqlConnection.query(sql, (err, rows, fields) => {
            if (!err) res.status(201).send("Role Created");
            else {
              res.status(400).send(err);
            }
          });
        })
        .catch(() => {
          res.status(409).send("role already exists");
        })
        .catch((err) => {
          res.status(401).send(err);
        });
    });
  } else {
    res.send(fieldError);
  }
};

exports.getRoleById = (req, res) => {
  const roleId = req.params.id;
  const permission = "get role";
  confirmPermission(req.user.roleId, permission)
    .then(() => {
      const sql = `SELECT * FROM role WHERE role_id = ${roleId}`;
      sqlConnection.query(sql, (err, rows, fields) => {
        if (!err && rows.length > 0) res.status(302).send(rows);
        else {
          res.status(400).send("role not found");
        }
      });
    })
    .catch((err) => {
      res.status(409).send(err);
    });
};

exports.getAllRoles = (req, res) => {
  const sql = `SELECT * FROM role`;
  const permission = "get role";
  confirmPermission(req.user.roleId, permission)
    .then(() => {
      sqlConnection.query(sql, (err, rows, fields) => {
        if (!err) res.status(302).send(rows);
        else {
          res.status(400).send(err);
        }
      });
    })
    .catch((err) => {
      res.status(409).send(err);
    });
};

exports.updateRole = (req, res) => {
  let { name, user_id } = req.body;
  const permission = "update role";
  const roleId = req.params.id;
  confirmPermission(req.user.roleId, permission)
    .then(() => {
      const sql = `UPDATE role SET role_name = "${name}", user_id=${user_id} WHERE role_id=${roleId}`;
      sqlConnection.query(sql, (err, rows, fields) => {
        if (!err) res.status(200).send("role updated");
        else {
          res.status(400).send(err);
        }
      });
    })
    .catch((err) => {
      res.status(409).send(err);
    });
};

exports.deleteRole = (req, res) => {
  const roleId = req.params.id;
  const permission = "delete role";
  confirmPermission(req.user.roleId, permission)
    .then(() => {
      const sql = `DELETE FROM role WHERE role_id = ${roleId} `;
      sqlConnection.query(sql, (err, rows, fields) => {
        if (!err) res.status(200).send("Role with id ${roleId} deleted");
        else {
          res.status(400).send(err);
        }
      });
    })
    .catch((err) => {
      res.status(409).send(err);
    });
};

exports.addRolePermission = (req, res) => {
  const roleId = req.params.id;
  const permission = req.body.permission;
  const permit = "add role to permission";
  confirmPermission(req.user.roleId)
    .then(() => {
      const sql = `SELECT permission_id FROM permission WHERE permission_name = "${permission}"`;
      sqlConnection.query(sql, (err, rows, fields) => {
        if (err) res.status(404).send(err);
        let permissionId = rows[0];
        sqlConnection.query(
          `INSERT INTO rolepermission VALUES(${roleId}, ${permissionId})`,
          (err, rows, fields) => {
            if (err) throw err;
            res.status(201).send("permission added to role");
          }
        );
      });
    })
    .catch(() => {
      res.status(409).send(err);
    });
};

exports.deleteRolePermission = (req, res) => {
  const roleId = req.params.id;
  const permisson = "delete permission from role";
  const permissionId = req.body.permission;
  confirmPermission(req.user.roleId, permission).then(() => {
    const sql = `DELETE FROM rolepermission WHERE permission_id = ${permissionId}, (err, rows, fields)=>{
        if(err) throw err
        res.status(200).send("permission deleted from role")
    }`;
  });
};
