const route = require("express").Router();
const permissionController = require("../controller/PermissionController");
const verifyUser = require("../Helpers/Verify");

route.post(
  "/api/addpermission",
  verifyUser,
  permissionController.createPermission
);
route.get(
  "/api/permission",
  verifyUser,
  permissionController.getAllPermissions
);
route.get(
  "/api/permission/:id",
  verifyUser,
  permissionController.getPermission
);
route.post(
  "/api/permission/delete/:id",
  verifyUser,
  permissionController.deletePermission
);
route.put(
  "/api/updatepermission/:id",
  verifyUser,
  permissionController.updatePermission
);

route.post(
  "/api/deletepermission/:id",
  verifyUser,
  permissionController.deletePermission
);

module.exports = route;
