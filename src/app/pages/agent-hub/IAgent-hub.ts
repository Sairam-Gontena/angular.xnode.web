export interface ITableInfo {
    delete_action: boolean;
    export_action: boolean;
    name: string;
    search_input: boolean;
    showAgentDataType: boolean;
}

export interface IPaginatorInfo {
    page: number;
    totalPages: number;
    totalRecords: number;
    perPage: number;
}

export interface IDropdownItem {
    label: string;
    icon: string;
    command: () => void;
}
