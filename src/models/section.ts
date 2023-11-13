export interface ContentArray extends Array<any> {
  content?: any;
}

export interface Section {
    title: string;
    content: string | string[] | object[] | Array<string | string[] | object[]>| ContentArray;
    id: string;
    created_on: string;
    modified_on: string;
    version: number;
    created_by: string;
    modified_by: string;
    showCommentOverlay?: boolean;
    collapsed?: boolean;
}
