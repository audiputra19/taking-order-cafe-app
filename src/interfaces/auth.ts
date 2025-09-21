export interface AuthState<T> {
    data: T;
    message: string;
}
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string | undefined;
}

export interface MeState<T> {
    user: T
}

export interface MeResponse {
    username: string;
    nama: string;
    hak_akses: number;
    iat: number;
    exp: number;
}