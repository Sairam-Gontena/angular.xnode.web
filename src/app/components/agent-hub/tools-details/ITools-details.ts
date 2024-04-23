//  Define the types/interface of properties.

export interface BreadcrumbItem {
    label: string;
    index: number;
    path?: string;
}

export interface BreadCrumbsAction {
    isBreadCrumbActive: boolean;
    breadcrumb: BreadcrumbItem[];
    activeBreadCrumbsItem?: string; // Optional property
}