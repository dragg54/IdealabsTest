const { sqlConnection } = require("../db/dbconnection");

const validateUserInput = (name, email, password, phone, role_id) => {
  let inputError = {};

  if (!email || !name || !phone || !password || !role_id) {
    inputError.fieldError = "field can't be empty";
  }

  if (!email.includes("@")) {
    inputError.emailInvalidError = "email is invalid";
  }

  if (password.length < 8) {
    inputError.passwordLengthError = "password is too short";
  }

  if (name.length > 30) {
    inputError.nameLengthError = "name too long";
  }

  const inputErrorName = Object.keys(inputError);
  if (inputErrorName.length > 0) {
    return inputError;
  } else {
    return null;
  }
};

const validateRoleInput =(roleName) =>{
  let inputError = {}
  if (!roleName) {
    inputError.fieldError = "field can't be empty";
  }
  const inputErrorName = Object.keys(inputError);
  if (inputErrorName.length > 0) {
    return inputError;
  } else {
    return null;
  }
}

const validatePermissionInput = (permissionName) =>{
   let inputError = {};
   if (!permissionName) {
     inputError.fieldError = "field can't be empty";
   }
   const inputErrorName = Object.keys(inputError);
   if (inputErrorName.length > 0) {
     return inputError;
   } else {
     return null;
   }
}


const validateGroupInput = (groupName) => {
  let inputError = {};
  if (!groupName) {
    inputError.fieldError = "field can't be empty";
  }
  const inputErrorName = Object.keys(inputError);
  if (inputErrorName.length > 0) {
    return inputError;
  } else {
    return null;
  }
};


module.exports = {
  validateUserInput,
  validateRoleInput,
  validatePermissionInput, 
  validateGroupInput
};
