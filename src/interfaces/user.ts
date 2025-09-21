export interface CreateUserRequest {
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
    nama: string;
    username: string;
    password: string;
    confirmPassword: string;
    hak_akses: number;
}

export interface DeleteUserResponse {
    message: string;
}