export interface NaviData {
    componentToShow: string;
    is_navi_expanded: boolean;
    restriction_max_value?: number;
    user: {
        first_name: string;
        last_name: string;
        email: string;
        account_id: string;
        user_id: string;
    };
    access_token: string;
    toggleConversationPanel: boolean;
    new_with_navi?: boolean;
    importFilePopupToShow?: boolean;
    showDockedNavi: boolean;
    product?: {
        id: string;
        title: string;
    };
    resource_id?: string;
    conversationDetails?: {
        id: string;
        isNew?: boolean;
        cId: string;
        conversation_type?: string;
        is_summarized?: boolean;
        is_navi_active?: boolean;
        content?: Content;
        users?: User[];
        status?: string;
        references?: any;
        createdBy?: any;
        isSummarizationQueue?: any;
        modifiedBy?: any;
        productId?: any;
    };
}

interface User {
    deepLink: string;
    userId: string;
    role: string;
    active: boolean;
}
interface UserInfo {
    id: string;
    display_name: string;
    full_name: string;
}

interface Intent {
    label: string;
    progress: string;
}

interface Feedback {
    upvote: string;
    downvote: string;
    feedback_text: string;
}

interface ConversationHistory {
    role: string;
    content: string;
    message_id: string;
    user_info: UserInfo;
    intent: Intent;
    feedback: Feedback[];
    timestamp: string;
}

interface ConversationUsage {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
}

interface ConversationDetails {
    conversation_history?: ConversationHistory[];
    conversation_usage?: ConversationUsage;
}

interface ConversationProgress {
    [key: string]: {
        status: string;
        conversation: any[]; // You might want to specify a more specific type if you have it
        conversation_summary: string;
    };
}

interface Content {
    email: string;
    is_navi_active: boolean;
    conversation_type: string;
    content_type: string;
    overview_data?: any; // You might want to specify a more specific type if you have it
    conversation_progress?: ConversationProgress;
    conversation_summary?: any; // You might want to specify a more specific type if you have it
    conversation_details?: ConversationDetails;
}
