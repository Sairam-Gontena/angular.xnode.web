import { Constant } from "../agent-hub.constant";

export const InitialPaginatorInfo = {
    page: 0,
    perPage: 10,
    totalPages: 0,
    totalRecords: 0,
};

//Agent prompt details
//prompt table row action option
export const promptTableRowActionOptions = [{
    label: 'View', icon: '',
    command: (event: any) => {
        console.log(event, 'event');
    }
}, {
    label: 'Duplicate', icon: '',
    command: (event: any) => {
        console.log(event, 'event');
    }
}, {
    label: 'Archieve', icon: '',
    command: (event: any) => {
        console.log(event, 'event');
    }
}, {
    label: 'Delete',
    icon: '',
    command: (event: any) => {
        console.log(event, 'event');
    }
}]

//prompt search filter options
export const promptSearchFilterOptions = {
    showFilterOption: true,
    filter: false,
    showToggleAll: false,
    showHeader: false
}

//agent hub detail object
export const agentHubDetail = {
    statsItem: Constant.stats,
    agentInfo: "",
    agentConnectedFlow: false,
    showActionButton: false,
    actionButtonOption: new Array(),
    breadCrumbsAction: {
        isBreadCrumbActive: false,
        breadcrumb: [{ label: 'Agent Hub', index: 0 }]
    }
}