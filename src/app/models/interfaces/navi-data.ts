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
    conversation_context: boolean;
    showDockedNavi: boolean;
    product?: {
        id: string;
        title: string;
    };
    conversatonDetails?: any;
}