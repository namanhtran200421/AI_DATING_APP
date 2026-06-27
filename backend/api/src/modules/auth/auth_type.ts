export type RegisterRequest = {
    email:string;
    password: string;
};

export type LoginRequest = {
    email:string;
    password: string;
};

export type OauthProvider = "GOOGLE" | "APPLE";

export type OAuthLoginRequest = {
    provider: OauthProvider; 
    identityToken: string;
};

