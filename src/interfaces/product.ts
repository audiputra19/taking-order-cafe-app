export interface GetProductResponse {
    id: string;
    outlet_id: string;
    nama: string;
    hpp: number;
    harga: number;
    kategori: number;
    deskripsi: string;
    image_title: string;
    image_path: string;
    created_at: string;
}

export interface CreateProductRequest {
    outlet_id: string;
    nama: string;
    hpp: number;
    harga: number;
    kategori: number;
    deskripsi: string;
    file?: File;
}

export interface CreateProductResponse {
    message: string;
}

export interface UpdateProductRequest {
    id: string;
    nama: string;
    hpp: number;
    harga: number;
    kategori: number;
    deskripsi: string;
    file?: File;
    image_title: string; 
    image_path: string; 
}

export interface UpdateProductResponse {
    message: string;
}

export interface DiscontinueProductResponse {
    message: string;
}