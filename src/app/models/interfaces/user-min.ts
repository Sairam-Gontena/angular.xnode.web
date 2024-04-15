export interface UserMin {
    userId:string | undefined;
    displayName:string;
    firstName?:string;
    lastName?:string;
    email:string;
    first_name?: string;
    last_name?: string;
}

export interface UserObjInConversation {
    userId:string;
    active?:boolean;
}
