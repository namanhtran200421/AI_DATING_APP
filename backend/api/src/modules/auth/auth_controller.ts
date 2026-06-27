import type {Request, Response} from "express";

import {
    loginWithEmail, 
    loginWithOAuth, 
    registerWithEmail,
} from "./auth_service.js";
import { findCurrentUserById } from './auth_repository.js';


export async function registerController(req:Request, res:Response) {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const result = await registerWithEmail(email, password);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data : {
                user: result.user,
                token: result.token,
            },
        });
    }catch (err:any) {
        console.log("error happen at: ", err);
        return res.status(400).json({
            message:" Registration failed"
        });
    }
}

export async function loginController (req:Request, res:Response) {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        const result = await loginWithEmail(email, password);

        return res.status(201).json({
            success: true, 
            message: "Login successfully",
            data: {
                user: result.user, 
                token: result.token,
            }
        });
    } catch (err:any) {
        console.log("error happen at: ", err);
        return res.status(401).json({
            message:"Login failed"
        });
    }
}

export async function oauthLoginController(req:Request, res:Response) {
    try {
        const {provider, identityToken} = req.body;
        if(!provider || !identityToken) {
            return res.status(400).json({
                message : "Provider and identity token are required"
            });
        }

        if(provider !== "GOOGLE" && provider !== "APPLE") {
            return res.status(400).json({
                message: "Invalid OAuth provider"
            });
        }

        const result = await loginWithOAuth(provider, identityToken);
        if(!result) {
            return res.status(400).json({
                message: "result is missing"
            });
        }

        return res.status(200).json({
            success: true, 
            message: "Oauth Login Successful",
            data: {
                user: result.user,
                token: result.token,

            }
        })

    } catch (err:any){
        console.log("Error happen at: ", err);
        return res.status(401).json({
            message: "Oauth Login Failed"
        });
    }
}

export async function getCurrentUserController(req: Request,res:Response ) {
    try {
        if(!req.user){
            return res.status(401).json({
                message: "Unauthorised",
            });
        }
        const user = await findCurrentUserById(req.user.userId);
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if(user.account_status !== "ACTIVE") {
            return res.status(403).json({
                message: "Account is not active"
            });
        }
        return res.status(200).json({
            success:true, 
            message:"retrieve successful",
            user: {
                userId: user.user_id,
                email: user.email,
                accountStatus: user.account_status,
                role: user.user_role,
                createdAt: user.created_at,
                updatedAt: user.updated_at,
            },
        });
    } catch (err:any){
        return res.status(500).json({
            message:"Failed to get current user"
        });

    }
}