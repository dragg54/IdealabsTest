const { sqlConnection } = require("../db/dbconnection");

const confirmPermission = (req, permission) => {
  return new Promise((resolve, reject) => {
    sqlConnection.query(
      `SELECT permission_id FROM permission WHERE permission_name = "${permission}"`,
      (err, rows, fields) => {
        if (err) throw err;
        const response = JSON.stringify(rows[0]);
        const permissionId = JSON.parse(response).permission_id;
        if (rows) {
          sqlConnection.query(`SELECT role_id from rolepermission WHERE permission_id = ${permissionId} AND role_id = ${req.user.roleId}`, (err,rows,fields)=>{
            if(rows.length > 0){
              resolve()
            }
            reject("you are not authorized to make this request")
          })
        }
      }
    );
  });
};

module.exports = confirmPermission;
