import type {NextFunction, Request, Response} from "express";
import {veritfyAccessToken} from "../shared/utils/jwt.js";

export function requireAuth(req:Request, res:Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        
        if(!authHeader) {
            return res.status(401).json({
                message : "Authentication header is missing"
            });
        } 

        const [scheme, token] = authHeader.split(" ");
        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid authorization format",
            });
        }

        const decodedUser = veritfyAccessToken(token);
        req.user = decodedUser;
        next();

    } catch (err:any) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}
