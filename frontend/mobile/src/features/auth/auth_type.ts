export type OAuthProvider = "GOOGLE" | "APPLE";

export type AuthUser= {
    user_id: number;
    email:string;
    account_status: string;
    role:string;
    created_at: string;
};

export type AuthResponse = {
    success:boolean;
    message: string;
    data: {
        user:AuthUser;
        token: string;
    };
};

export type OAuthLoginRequest = {
  provider: OAuthProvider;
  identityToken: string;
};

export type AuthStatusResponse = {
  success:boolean;
  data: {
    user:AuthUser;
    hasCompletedOnboarding?:boolean; //derived attribute
  }
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};