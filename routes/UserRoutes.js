const express = require("express");
const route = express.Router();
const userController = require("../controller/UserController");
const verifyUser = require("../Helpers/Verify");

route.post("/api/adduser",verifyUser, userController.createUser);
route.get("/api/user", verifyUser, userController.getAllUserRecord);
route.get("/api/user/:id", userController.getUserRecord)
route.post("/api/user/delete/:id", userController.deleteUser)
route.put("/api/updateuser/:id", verifyUser, userController.updateUser);
route.post("/login", userController.loginUser)

module.exports = route;
