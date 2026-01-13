export interface CreateUserRequest {
    outlet_id: string;
    nama: string;
    username: string;
    password: string;
    confirmPassword: string;
    hak_akses: number;
}

export interface CreateUserResponse {
    message: string;
}

export interface GetUserResponse {
    outlet_id: string;
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    hak_akses: number;
}

export interface DeleteUserResponse {
    message: string;
}