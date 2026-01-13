export interface TotalOrderRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface TotalOrderResponse {
    current: {total_order: number};
    previous: {total_order: number};
    message?: string;
}

export interface OrderCanceledRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface OrderCanceledResponse {
    current: {total_order: number};
    previous: {total_order: number};
    message?: string;
}

export interface AverageOrderRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface AverageOrderResponse {
    current: {average: number, unit: string;};
    previous: {average: number, unit: string;};
    message?: string;
}

export interface CategoryPerformanceRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface CategoryPerformanceResponse {
    category: number;
    qty: number;
    message?: string;
}

export interface OrderTrendResponse {
    id: string;
    createdAt: string;
    qty: number;
    message?: string;
}

export interface BestSellingProductsRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface BestSellingProductsResponse {
    name: string;
    qty: number;
    message?: string;
}

export interface LowestSellingProductsRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface LowestSellingProductsResponse {
    name: string;
    qty: number;
    message?: string;
}

export interface AverageFulfillmentTimeRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface AverageFulfillmentTimeResponse {
    acc_kasir: number;
    acc_dapur: number;
    ready: number;
    total: number;
    message?: string;
}

export interface PeakOrderTimeRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface PeakOrderTimeResponse {
    category: string;
    qty: number;
    message?: string;
}

export interface TotalRevenueRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface TotalRevenueResponse {
    current: {total_revenue: number};
    previous: {total_revenue: number};
    message?: string;
}

export interface TotalProfitRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface TotalProfitResponse {
    current: {total_profit: number};
    previous: {total_profit: number};
    message?: string;
}

export interface AverageOrderValueRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface AverageOrderValueResponse {
    current: {total: number};
    previous: {total: number};
    message?: string;
}

export interface RevenueByProductRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface RevenueByProductResponse {
    category: string;
    qty: number;
    message?: string;
}

export interface RevenueByCategoryRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface RevenueByCategoryResponse {
    category: number;
    qty: number;
    message?: string;
}

export interface RevenueTrendResponse {
    id: string;
    createdAt: string;
    qty: number;
    message?: string;
}

export interface TopPaymentMethodRequest {
    outlet_id: string | undefined;
    periode: number;
}

export interface TopPaymentMethodResponse {
    name: string;
    qty: number;
    message?: string;
}