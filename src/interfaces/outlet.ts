export interface AddOutletProps {
    id: number;
    name: string;
}

export interface AddOutletRequest {
    company_id?: string;
    fullname: string; 
    phone: number;
    email: string;
    cafeName: string;
    address: string;
    phoneCafe: number;
    province: AddOutletProps | null;
    city: AddOutletProps | null;
    district: AddOutletProps | null;
    village: AddOutletProps | null;
    postalCode: number; 
    username: string;
    password: string;
    confirmPassword: string;
}

export interface AddOutletResponse {
    message: string;
}

export interface GetOutletRequest {
    company_id: string | undefined;
}

export interface GetOutletResponse {
    company_id: string;
    outlet_id: string;
    name: string;
    address: string;
    phone: string;
}