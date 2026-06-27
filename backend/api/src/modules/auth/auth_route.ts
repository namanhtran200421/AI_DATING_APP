import express from "express";
import {
    loginController,
    oauthLoginController,
    registerController,
} from "./auth_controller.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/oauth", oauthLoginController);

export default router;