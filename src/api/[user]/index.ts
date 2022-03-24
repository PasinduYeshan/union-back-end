import { Router } from "express";
import auth from "../../utils/auth";

import registerUserAccount from "./register/register";
import loginUserAccount from "./login/user";
import updateUser from "./update/details";
import updatePassword from "./update/password";
import forgotPassword from "./update/forgot-password";
import resetPassword from "./update/reset-password";

import avatar from "./update/avatar";
import password from "./update/password";
import details from "./update/details";
import get_details from "./get_details";
import refresh from "./login/refresh";

const rUser = Router();

// rUser.get('/details', auth.any, get_details)

// User Login
rUser.post("/login", loginUserAccount);
// rUser.post("/refresh", refresh)

// Register Users
rUser.post("/register-sa", registerUserAccount);
rUser.post("/register", auth.adminEditor, registerUserAccount); // Only admin can register other users

// Update User Account
rUser.put("/update/:userId", auth.admin, updateUser.account);
rUser.put("/update-profile", auth.any, updateUser.profile);

// Update password
rUser.put("/update-password", auth.any, updatePassword);
rUser.put("/change-password/:userId", auth.adminEditor, updatePassword);

// Forget password
rUser.post("/forgot-password", forgotPassword);
rUser.put("/reset-password", resetPassword);

// rUser.put("/set-avatar/:userId*?", auth.any, avatar)
// rUser.put("/set-password/:userId*?", auth.any, password)
// rUser.put("/set-details/:userId*?", auth.any, details)

// rUser.post("/reset-password", reset_password)
// rUser.post("/send-reset-password", send_reset_password)

export default rUser;
