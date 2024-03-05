export interface ITableDataEntry {
    id: string;
    agent: string;
    description: string;
    state: string;
    status: string;
    createdBy: string;
    "action-btn": string;
}

export interface ITableInfo {
    delete_action: boolean;
    export_action: boolean;
    name: string;
    search_input: boolean;
}

export interface IDropdownItem {
    label: string;
    icon: string;
    command: () => void;
}
