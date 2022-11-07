const { sqlConnection } = require("../db/dbconnection")

const duplicateRoleChecker=(roleName)=>{
    return new Promise((resolve, reject)=>{
        const sql = `SELECT * FROM role WHERE role_name = "${roleName}"`
        sqlConnection.query(sql, (err, rows, fields)=>{
            if(!rows){
                resolve()
            }
            else{
                reject()
            }
        })
    }) 
}

const duplicatePermissionChecker = (permissionName)=> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM permission WHERE permission_name = "${permissionName}"`;
    sqlConnection.query(sql, (err, rows, fields) => {
      if (rows.length <= 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};


const duplicateGroupChecker = (groupName) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM grp WHERE group_name = "${groupName}"`;
    sqlConnection.query(sql, (err, rows, fields) => {
      if (rows.length <= 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

const duplicateGroupMemberChecker= (userId, groupId) =>{
    return new Promise((resolve, reject)=>{
        const sql = `SELECT * FROM usergroup WHERE group_id = ${groupId} AND user_id = ${userId}`
        sqlConnection.query(sql, (err, rows, fields)=>{
            console.log(rows)
            if(rows.length <= 0){
                resolve()
            }
            else{
                reject()
            }
        })
    })
}

module.exports = {
    duplicateRoleChecker,
    duplicatePermissionChecker,
    duplicateGroupChecker, 
    duplicateGroupMemberChecker
}