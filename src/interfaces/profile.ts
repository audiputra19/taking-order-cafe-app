export interface CreateCompanyProfileRequest {
    name: string;
    address: string;
    file?: File;
}

export interface CreateCompanyProfileResponse {
    message: string;
}

export interface GetCompanyProfileResponse {
    name: string;
    address: string;
    image_title: string;
    image_path: string;
    message?: string;
}