export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    entity_id: string;
    entity_name: string;
    account_id: string;
    account_name: string;
    account_type: string;
    product_tier_id: string;
    product_tier_name: string;
    account_owner: string;
    role_id: string;
    role_name: string;
    phone: string;
    image?: string;
}
