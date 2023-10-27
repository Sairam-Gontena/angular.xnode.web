export interface Section {
    title: string;
    content: string;
    id: string;
    created_on: string;
    modified_on: string;
    version: number;
    created_by: string;
    modified_by: string;
    showCommentOverlay?: boolean;
}