export interface CreateVoucherRequest{
    nama: string;
    min_belanja: number;
    persen: number;
    due_date: string;
}

export interface CreateVoucherResponse {
    message: string;
}