export interface CreateVoucherRequest{
    nama: string;
    min_belanja: number;
    persen: number;
    due_date: string;
}

export interface CreateVoucherResponse {
    message: string;
}

export interface GetVoucherResponse {
    id_voucher: string;
    nama: string;
    min_belanja: number;
    persen: number;
    due_date: string;
}

export interface UpdateVoucherRequest{
    nama: string;
    min_belanja: number;
    persen: number;
    due_date: string;
    id_voucher: string;
}

export interface UpdateVoucherResponse {
    message: string;
}

export interface DeleteVoucherResponse {
    message: string;
}