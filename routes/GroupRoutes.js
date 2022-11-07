const route = require("express").Router();
const groupController = require("../controller/GroupController");
const verifyUser = require("../Helpers/Verify");

route.post(
  "/api/addgroup",
  verifyUser,
  groupController.createGroup
);
route.get(
  "/api/group",
  verifyUser,
  groupController.getAllGroup
);
route.get(
  "/api/group/:id",
  verifyUser,
  groupController.getGroupById
);

route.put(
  "/api/updategroup/:id",
  verifyUser,
  groupController.updateGroup
);

route.post(
  "/api/deletegroup/:id",
  verifyUser,
  groupController.deleteGroup
);

route.post("/api/group/addmember/:id", verifyUser, groupController.addUserToGroup)

module.exports = route;
