const route = require("express").Router()
const roleController = require("../controller/RoleController")
const verifyUser = require("../Helpers/Verify");

route.post("/api/addrole", verifyUser, roleController.createRole);
route.get("/api/role", verifyUser, roleController.getAllRoles);
route.get("/api/role/:id",verifyUser, roleController.getRoleById);
route.post("/api/role/delete/:id", verifyUser, roleController.deleteRole);
route.put("/api/updaterole/:id",verifyUser, roleController.updateRole);
route.post("/api/role/:id/addpermission/", verifyUser, roleController.addRolePermission)
route.post("api/role/:id/deletepermission", verifyUser, roleController.deleteRolePermission)

module.exports = route