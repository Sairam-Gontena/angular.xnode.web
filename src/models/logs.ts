export interface Logs {
    email: string;
    product_id: string;
    product_name: string;
    component: string;
    description: string;
    spec_status: string;
    type: string;
    read: boolean;
    important: boolean;
    pinned: boolean;
    recent: boolean;
}