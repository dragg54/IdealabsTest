const mysql = require("mysql")

const sqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ajibolas7",
    database: "Idealabs",
})

const connectDb = async () => {
  sqlConnection.connect((err) => {
    if (!err)console.log("connected successfully");
  });
};

module.exports = {
  connectDb,
  sqlConnection,
};