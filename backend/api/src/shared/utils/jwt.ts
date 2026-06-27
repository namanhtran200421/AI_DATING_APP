import jwt, { type SignOptions } from "jsonwebtoken";

export type JwtPayload = {
    userId: number;
    email: string;
    role: string;
};

export function createAccessToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }

    //should be in .env ?
    const options: SignOptions = {
        expiresIn: "1d",
    };

    return jwt.sign(payload, secret, options);

}

export function veritfyAccessToken ( token: string):JwtPayload {
    const secret = process.env.JWT_SECRET;

    if(!secret) {
        throw new Error("secret is gone");
    }    

    const decoded = jwt.verify(token, secret);

    if(
        typeof decoded !== "object" || 
        decoded === null ||
        typeof decoded.userId !== "number" ||
        typeof decoded.email !== "string" ||
        typeof decoded.role !== "string"

    ) {
        throw new Error("Invalid token payload");
    }

    return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,

    }

}

