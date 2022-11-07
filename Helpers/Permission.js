const { sqlConnection } = require("../db/dbconnection");

const confirmPermission = (req, permission) => {
  return new Promise((resolve, reject) => {
    sqlConnection.query(
      `SELECT * FROM rolepermission WHERE role_id = ${req.user.roleId}`,
      (err, rows, fields) => {
        if(err) throw err
        if(rows.length > 0 ){
            const permissionId = JSON.stringify(rows[0])
              sqlConnection.query(
                `SELECT permission_name FROM permission WHERE permission_id = ${JSON.parse(permissionId).permission_id}`,
                (err, rows, fields) => {
                const result = JSON.stringify(rows[0])
                const error = "you are not authorized to make this request"
                  if (JSON.parse(result).permission_name === permission) {
                    resolve();
                  } else {
                    reject(error);
                  }
                }
              );
            }
        }
    );
  });
};

module.exports = confirmPermission;
