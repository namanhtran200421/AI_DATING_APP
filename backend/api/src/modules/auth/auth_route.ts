import express from "express";
import {
    loginController,
    oauthLoginController,
    registerController,
} from "./auth_controller.js";
import { requireAuth } from "../../middleware/auth_middleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/oauth", oauthLoginController);
router.post("/me", requireAuth, oauthLoginController);

export default router;