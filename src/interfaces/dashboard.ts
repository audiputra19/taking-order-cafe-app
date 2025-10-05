export interface TotalOrderRequest {
    periode: number;
}

export interface TotalOrderResponse {
    current: {total_order: number};
    previous: {total_order: number};
    message?: string;
}

export interface OrderCanceledRequest {
    periode: number;
}

export interface OrderCanceledResponse {
    current: {total_order: number};
    previous: {total_order: number};
    message?: string;
}

export interface AverageOrderRequest {
    periode: number;
}

export interface AverageOrderResponse {
    current: {average: number, unit: string;};
    previous: {average: number, unit: string;};
    message?: string;
}

export interface CategoryPerformanceRequest {
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
    periode: number;
}

export interface BestSellingProductsResponse {
    name: string;
    qty: number;
    message?: string;
}

export interface LowestSellingProductsRequest {
    periode: number;
}

export interface LowestSellingProductsResponse {
    name: string;
    qty: number;
    message?: string;
}

export interface AverageFulfillmentTimeRequest {
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
    periode: number;
}

export interface PeakOrderTimeResponse {
    category: string;
    qty: number;
    message?: string;
}

export interface TotalRevenueRequest {
    periode: number;
}

export interface TotalRevenueResponse {
    current: {total_revenue: number};
    previous: {total_revenue: number};
    message?: string;
}

export interface TotalProfitRequest {
    periode: number;
}

export interface TotalProfitResponse {
    current: {total_profit: number};
    previous: {total_profit: number};
    message?: string;
}

export interface AverageOrderValueRequest {
    periode: number;
}

export interface AverageOrderValueResponse {
    current: {total: number};
    previous: {total: number};
    message?: string;
}

export interface RevenueByProductRequest {
    periode: number;
}

export interface RevenueByProductResponse {
    category: string;
    qty: number;
    message?: string;
}

export interface RevenueByCategoryRequest {
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
    periode: number;
}

export interface TopPaymentMethodResponse {
    name: string;
    qty: number;
    message?: string;
}