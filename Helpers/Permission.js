const { sqlConnection } = require("../db/dbconnection");

const confirmPermission = (req, permission) => {
  return new Promise((resolve, reject) => {
    sqlConnection.query(
      `SELECT permission_id FROM rolepermission WHERE role_id = "${req.user.roleId}"`,
      (err, rows, fields) => {
        if (err) throw err;
        if (rows.length > 0) {
          const response = JSON.stringify(rows);
          const permissionId = JSON.parse(response)
          permissionId.forEach((permissions) => {
             sqlConnection.query(
               `SELECT permission_name FROM permission WHERE permission_id = ${permissions.permission_id} AND permission_name  = "${permission}"`,
               (err, rows, fields) => {
                 if(rows.length !== null ){
                  resolve()
                  return
                 }
                 reject("you are not authorized to make this request")

               })}
          );
        }
      }
    );
  });
};

module.exports = confirmPermission;
