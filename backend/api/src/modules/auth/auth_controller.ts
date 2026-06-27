import type {Request, Response} from "express";
import {
    loginWithEmail, 
    loginWithOAuth, 
    registerWithEmail,
} from "./auth_service.js";


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