
import {OAuth2Client} from "google-auth-library";
import {jwtVerify} from "jose";
import {comparePassword, hashPassword} from "../../shared/utils/password.js"
import {
    createEmailPasswordUser,
    createOAuthUser,
    findAuthProvider,
    findUserByEmail,
    linkOAuthProviderToExistingUser,
} from "./auth_repository.js";
import { createAccessToken } from '../../shared/utils/jwt.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

type OAuthUserInfo = {
    providerUserId: string;
    email:string;
};

export async function registerWithEmail(email:string, password: string) {
    const existingUser = await findUserByEmail(email);

    if(existingUser) {
        throw new Error("Email is already registered");
    }

    const passwordHash = await hashPassword(password);
    const user = await createEmailPasswordUser(email, passwordHash);

    const token = createAccessToken({
        userId: user.user_id,
        email:user.email, 
        role: user.user_role,
    });

    return {
        user, token
    };
}

export async function loginWithEmail(email:string, password:string) {
    const user = await findUserByEmail(email);
    console.log(user);
    if(!user){
        throw new Error("Invalid email or password");
    }

    if(user.account_status !== "ACTIVE"){
        throw new Error("Account is not active");
    }

    if(!user.password_hash){
        throw new Error("This account use social login");
    }

    const isPasswordCorrect = await comparePassword(password, user.password_hash);

    if(!isPasswordCorrect){
        throw new Error ("Invalid email or password");
    }

    const token = createAccessToken({
        userId: user.user_id,
        email: user.email,
        role: user.user_role,
    });

    return {
        user: {
            //do not include hash to frontend
            user_id: user.user_id,
            email: user.email,
            user_role: user.user_role,
        },
        token,
    };
}

async function verifyGoogleToken(identityToken: string): Promise<OAuthUserInfo> {

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if(!googleClientId) {
        throw new Error("Google id is missing");
    }

    const ticket = await googleClient.verifyIdToken({
        idToken: identityToken,
        audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if(!payload || !payload.sub || !payload.email) {
        throw new Error("Invalid Google Token");
    }

    return {
        providerUserId: payload.sub,
        email: payload.email,
    };
}


export async function loginWithOAuth(provider: "GOOGLE" | "APPLE", IdentityToken: string){

    let oauthUser : OAuthUserInfo;

    if(provider === "GOOGLE") {
        oauthUser = await verifyGoogleToken(IdentityToken)
    // } else {
    //     oauthUser = await verifyAppleToken(IdentityToken)
    // }

    const existingProviderUser = await findAuthProvider(
        provider, oauthUser.providerUserId
    );

    if(existingProviderUser) {
        const token = createAccessToken({
            userId: existingProviderUser.user_id,
            email:existingProviderUser.email,
            role: existingProviderUser.user_role
        });
        return {
            user: existingProviderUser,
            token,
        };
    }

    const existingUserByEmail = await findUserByEmail(oauthUser.email);

    if(existingProviderUser) {
        await linkOAuthProviderToExistingUser(
            existingUserByEmail.user_id, 
            provider, 
            oauthUser.providerUserId
        );

        const token = createAccessToken({
            userId: existingProviderUser.user_id,
            email:existingProviderUser.email,
            role: existingProviderUser.user_role
        });

        return {
            user: existingProviderUser, 
            token
        };
    }

    const newUser = await createOAuthUser(
        oauthUser.email, 
        provider, 
        oauthUser.providerUserId
    );

    const token = createAccessToken({
        userId: newUser.user_id, 
        email: newUser.email,
        role: newUser.user_role
    });
    return {
        user: newUser, 
        token,
    };


} 
}















// async function verifyAppleToken(identityToken: string): Promise<OAuthUserInfo> {
//     const appleClientId = process.env.APPLE_CLIENT_ID;

//     if (!appleClientId) {
//         throw new Error("APPLE_CLIENT_ID is missing");
//     }

//     const appleKeys = createRemoteJWKSet(
//         new URL("https://appleid.apple.com/auth/keys")
//     );

//     const result = await jwtVerify(identityToken, appleKeys, {
//         issuer: "https://appleid.apple.com",
//         audience: appleClientId,
//     });

//     const payload = result.payload;

//     if (!payload.sub || !payload.email) {
//         throw new Error("Invalid Apple token");
//     }

//     return {
//         providerUserId: String(payload.sub),
//         email: String(payload.email),
//     };
// }







