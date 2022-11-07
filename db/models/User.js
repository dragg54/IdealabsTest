const { sqlConnection } = require("../dbconnection")

class UserClass {
    constructor(name, email, phone, password, roleId){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.roleId = roleId
    }
   create(req, res){
    const sql = `INSERT INTO user(name, email, phone, password, role_id) VALUES("${this.name}", "${this.email}", "${this.phone}", "${this.password}", ${this.roleId})`;
    sqlConnection.query(sql, (err, rows, fields) => {
      if (!err) {
        return res.status(201).send(rows);
      } else {
        return res.status(500).send(err);
      }
    });
   }
}

module.exports = UserClass