import jwt, { type SignOptions } from "jsonwebtoken";

type JwtPayload = {
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

