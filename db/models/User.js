const { sqlConnection } = require("../dbconnection")

class UserClass {
    constructor(name, email, phone, password, roleId){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.roleId = roleId
    }
}

module.exports = UserClass