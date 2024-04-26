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

//dialog config detail
export const dialogConfigDetail = {
    data: {},
    showHeader: false,
    header: '',
    width: '50vw',
    styleClass: 'customHeaderDynamicDialog',
    contentStyle: { overflow: 'auto' },
    breakpoints: { '960px': '75vw', '640px': '90vw' },
    templates: {
        header: '',
        footer: ''
    }
}

//agent header action options
export const agentHeaderActionOptions = {
    overview: {
        buttonText: 'Action',
        options: [{ label: 'Add Agent', eventType: 'CREATE', eventName: 'Agent', icon: '', command: (() => { }) }]
    },
    agent: {
        buttonText: 'Action',
        options: [{ label: 'Add Agent', eventType: 'CREATE', eventName: 'Agent', icon: '', command: () => { } },
        { label: 'Import Agent', eventType: 'IMPORT', eventName: 'Agent', icon: '', command: () => { } }]
    },
    agent_instructions: {
        buttonText: 'Action',
        options: [{ label: 'Add Agent', eventType: 'CREATE', eventName: 'Agent', icon: '', command: () => { } }]
    },
    capability: {
        buttonText: 'Action',
        options: [{ label: 'Add Capability', eventType: 'CREATE', eventName: 'Capability', icon: '', command: () => { } },
        { label: 'Import Capability', eventType: 'IMPORT', eventName: 'Capability', icon: '', command: () => { } }]
    },
    topic: {
        buttonText: 'Action',
        options: [{ label: 'Add Topic', eventType: 'CREATE', eventName: 'Topic', icon: '', command: () => { } },
        { label: 'Import Topic', eventType: 'IMPORT', eventName: 'Topic', icon: '', command: () => { } }
        ]
    },
    prompt: {
        buttonText: 'Action',
        options: [{ label: 'Add Prompt', eventType: 'CREATE', eventName: 'Prompt', icon: '', command: () => { } },
        { label: 'Import Prompt', eventType: 'IMPORT', eventName: 'Prompt', icon: '', command: () => { } }
        ]
    },
    knowledge: {
        buttonText: 'Action',
        options: [{ label: 'Add Knowledge', eventType: 'CREATE', eventName: 'Knowledge', icon: '', command: () => { } },
        { label: 'Import Knowledge', eventType: 'IMPORT', eventName: 'Knowledge', icon: '', command: () => { } }
        ]
    },
    model: {
        buttonText: 'Action',
        options: [{ label: 'Add Model', eventType: 'CREATE', eventName: 'Model', icon: '', command: () => { } },
        { label: 'Import Model', eventType: 'IMPORT', eventName: 'Model', icon: '', command: () => { } }
        ]
    },
    tool: {
        buttonText: 'Action',
        options: [{ label: 'Add Tool', eventType: 'CREATE', eventName: 'Tool', icon: '', command: () => { } },
        { label: 'Import Tool', eventType: 'IMPORT', eventName: 'Tool', icon: '', command: () => { } }
        ]
    },
}