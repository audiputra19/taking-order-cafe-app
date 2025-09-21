export interface GetOrder {
    order_id: string;
    meja: string;
    total: number;
    status: string;
    proses: string;
    created_at: string;
}

export interface OrderRequest {
    order_id: string;
}

export interface OrderResponse {
    message: string;
}

export interface GetOrderByIdResponse {
    order_id: string;
    nama: string;
    harga: number;
    qty: number;
}