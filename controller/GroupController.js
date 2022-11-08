const { sqlConnection } = require("../db/dbconnection");
const GroupClass = require("../db/models/Group");
const verifyUser = require("../Helpers/Verify");
const { duplicateGroupChecker, duplicateGroupMemberChecker } = require("../Helpers/DuplicateCheckers");
const { validateGroupInput } = require("../Helpers/ValidateInputs");
const confirmPermission = require("../Helpers/Permission");

//create group
exports.createGroup = (req, res) => {
  const groupName = req.body.groupName;
  const group = new GroupClass(groupName);
  const fieldError = validateGroupInput(groupName);
  const permission = "create group"
  if (fieldError === null) {
    confirmPermission(req, permission)
    .then(()=>{
       duplicateGroupChecker(groupName)
         .then(() => {
           const sql = `INSERT INTO grp(group_name) VALUES("${group.groupName}")`;
           sqlConnection.query(sql, (err, rows, field) => {
             if (err) res.status(400);
             res.status(201).send(`Group ${groupName} created`);
           });
         })
         .catch(() => {
           res.status(409).send("group already exists");
         });
    }).catch((err)=>{
      res.status.send(err)
    })
  }
};

//get all groups
exports.getAllGroup = (req, res) => {
  const sql = `SELECT * FROM grp`;
  const permission = "get group"
  confirmPermission(req, permission)
  .then(()=>{
     sqlConnection.query(sql, (err, rows, fields) => {
       if (!err) res.status(302).send(rows);
       else {
         res.status(400).send(err);
       }
     });
  }).catch((err)=>{
      res.status(409).send(err)
  })
};

//get group by id
exports.getGroupById = (req, res) => {
  const groupId = req.params.id;
  const permission = "get group"
  confirmPermission(req, permission)
  .then(()=>{
     const sql = `SELECT * FROM role WHERE group_id = ${groupId}`;
     sqlConnection.query(sql, (err, rows, fields) => {
       if (!err) res.status(302).send(rows);
       else {
         res.status(400).send(err);
       }
     });
  }).catch((err)=>{
    res.status(409).send(err)
  })
 
};

//update group
exports.updateGroup = (req, res) => {
  let { name } = req.body;
  let { groupId } = req.params.id;
  const permission = "update group"
  confirmPermission(req, permission)
  .then(()=>{
     const sql = `UPDATE grp SET name = "${name}" WHERE group_id = ${groupId}`;
     sqlConnection.query(sql, (err, rows, fields) => {
       if (!err) res.status(200).send("group updated");
       else {
         res.status(400).send(err);
       }
     }).catch((err)=>{
      res.status(409).send(err)
     })
  })
 
};

//delete group
exports.deleteGroup = (req, res) => {
  const groupId = req.params.id;
  const permission = "delete group"
  confirmPermission(req, permission)
  .then(()=>{
     const sql = `DELETE FROM grp WHERE group_id = ${groupId} `;
     sqlConnection.query(sql, (err, rows, fields) => {
       if (!err) res.status(200).send("Role with id ${groupId} deleted");
       else {
         res.status(400).send(err);
       }
     });
  }).catch((err)=>{
    res.status(409).send(err)
  })
 
};

//add user to group
exports.addUserToGroup = (req, res) => {
  const groupId = req.params.id;
  const member = req.body.userId;
  const permission = "add user to group"

  confirmPermission(req, permission)
  .then(()=>{
    duplicateGroupMemberChecker(member, groupId)
      .then(() => {
        sqlConnection.query(
          `INSERT INTO usergroup(user_id, group_id) VALUES(${member}, ${groupId})`,
          (err, rows, fields) => {
            if (err) throw err;
            res
              .status(200)
              .send(`${member} has been added to group ${groupId}`);
          }
        );
      })
      .catch(() => {
        res.send("user already belongs to group");
      });
  }).catch((err)=>{
    res.status(409).send(err)
  })
};

//get group members
exports.getMember = (req, res) => {
  const groupId = req.params.id;
  const sql = `SELECT user_id from usergroup WHERE group_id = ${groupId}`;
  const permission = "get member"
 confirmPermission(req, permission)
 .then(()=>{
   sqlConnection.query(sql, (err, rows, fields) => {
     if (err) throw err;
     res.status(200).send(rows);
   });
 }).catch(()=>[
  res.send(409).send(err)
 ])
};

exports.deleteMember = (req, res) => {
  const groupId = req.params.id;
  const permission = "delete member"
  confirmPermission(req, permission)
  .then(()=>{
     const sql = `DELETE from usergroup WHERE group_id = ${groupId}`;
     sqlConnection.query(sql, (err, rows, fields) => {
       if (err) throw err;
       res.status(200).send(rows);
     });
  }).catch((err)=>{
    res.status(409).send(err)
  })
 
};
