import bcrypt from "bcrypt";
import {SALT_ROUNDS} from "../constants/constant.js";

export async function hashPassword(password: string): Promise<string>{
    return bcrypt.hash(password, SALT_ROUNDS);
};

export async function comparePassword(password: string,passwordHash: string): Promise <boolean> {
    return bcrypt.compare(password, passwordHash);
}

