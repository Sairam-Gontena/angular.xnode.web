export interface Product {
    user_id: string;
    email: string;
    username: string;
    id: string;
    status: string;
    title: string;
    created_on: string;
    product_name: string;
    product_description: string;
    product_url: string;
    url?: string;
    has_insights: boolean;
    file_metadata: {
        file_uploaded_status: boolean;
        file_path: string;
    };
}