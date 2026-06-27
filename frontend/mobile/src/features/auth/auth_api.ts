import {apiClient} from "../../service/apiClient";

import type {
    AuthResponse,
    LoginRequest,
    OAuthLoginRequest,
    RegisterRequest,
    AuthStatusResponse
} from "./auth_type";

export function registerUser(payload: RegisterRequest):Promise<AuthResponse> {
    return apiClient<AuthResponse>("/api/auth/signup", {
        method: "POST", 
        body:payload
    });
}
export function loginUser(payload: LoginRequest):Promise<AuthResponse> {
    return apiClient<AuthResponse>("/api/auth/login", {
        method: "POST", 
        body:payload
    });
}
export function loginWithOauth(payload:OAuthLoginRequest ): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/api/auth/oauth",{method:"POST", body:payload});
}

export function getAuthStatus(token:string):Promise<AuthStatusResponse> {
    return apiClient<AuthStatusResponse>("/api/auth/me", {
        method:"GET", 
        token
    });
}