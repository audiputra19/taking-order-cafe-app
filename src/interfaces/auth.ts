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

export interface RegisterProps {
    id: number;
    name: string;
}

export interface RegisterRequest {
    outlet_id?: string;
    fullname: string; 
    phone: number;
    email: string;
    cafeName: string;
    address: string;
    phoneCafe: number;
    province: RegisterProps | null;
    city: RegisterProps | null;
    district: RegisterProps | null;
    village: RegisterProps | null;
    postalCode: number; 
    username: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    message: string;
}

export interface MeState<T> {
    user: T
}

export interface MeResponse {
    company_id: string;
    outlet_id: string;
    username: string;
    name: string;
    hak_akses: number;
    iat: number;
    exp: number;
}