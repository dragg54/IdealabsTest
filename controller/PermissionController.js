const { sqlConnection } = require("../db/dbconnection");
const PermissionClass = require("../db/models/Permissions");
const { validatePermissionInput } = require("../Helpers/ValidateInputs");
const { duplicatePermissionChecker } = require("../Helpers/DuplicateCheckers");

//create permission
exports.createPermission = (req, res) => {
  const permissionName = req.body.permission_name;
  const permission = new PermissionClass(permissionName);
  const fieldError = validatePermissionInput(permissionName);
  if (fieldError === null) {
    duplicatePermissionChecker(permissionName)
      .then(() => {
        const sql = `INSERT INTO permission(permission_name) VALUES("${permission.permissionName}")`;
        sqlConnection.query(sql, (err, rows, fields) => {
          if (err) throw err;
          res.status(201).send("Permission created");
        });
      })
      .catch(() => {
        res.status(409).send("permission already exists");
      });
  } else {
    res.send(fieldError);
  }
};

//get all permissions
exports.getAllPermissions = (req, res) => {
  const sql = `SELECT * FROM Permission`;
  sqlConnection.query(sql, (err, rows, fields) => {
    if (!err) res.status(302).send(rows);
    else {
      res.status(400).send(err);
    }
  });
};

//get permission by id
exports.getPermission = (req, res) => {
  const PermissionId = req.params.id;
  const sql = `SELECT * FROM Permission WHERE Permission_id = ${PermissionId}`;
  sqlConnection.query(sql, (err, rows, fields) => {
    if (!err) res.status(302).send(rows);
    else {
      res.status(400).send(err);
    }
  });
};

//update permission
exports.updatePermission = (req, res) => {
  const { permissionName } = req.body;
  const permissionId = req.params.id;
  const sql = `UPDATE permission SET permission_name = "${permissionName}" WHERE permission_id = ${permissionId}`;
  sqlConnection.query(sql, (err, rows, fields) => {
    if (!err) res.status(200).send("permission updated");
    else {
      res.status(400).send(err);
    }
  });
};

//delete persmission
exports.deletePermission = (req, res) => {
  const PermissionId = req.params.id;
  const sql = `DELETE FROM permission WHERE permission_id = ${PermissionId} `;
  sqlConnection.query(sql, (err, rows, fields) => {
    if (!err)
      res.status(200).send(`Permission with id ${PermissionId} deleted`);
    else {
      res.status(400).send(err);
    }
  });
};
