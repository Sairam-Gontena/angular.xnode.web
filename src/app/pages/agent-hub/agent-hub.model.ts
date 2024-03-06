/**
 * Represents the model for the Agent Hub page.
 */
import { LocalStorageService } from "src/app/components/services/local-storage.service";
import dynamicTableColumnData from "../../../assets/json/dynamictabledata.json";
import { IDropdownItem, ITableDataEntry, ITableInfo } from "./IAgent-hub";
import { AgentHubService } from "src/app/api/agent-hub.service";
import { StorageKeys } from "src/models/storage-keys.enum";
import { Constant } from "./agent-hub.constant";

export class AgentHubModel {
    columns: any; // Define the type of columns based on the actual data structure
    activeIndex: number;
    tabItems: { title: string, value: string }[];
    tableData!: ITableDataEntry[];
    tableInfo: ITableInfo = {
        delete_action: false,
        export_action: false,
        name: "Notification List",
        search_input: true
    };
    agentTabItemDropdown: IDropdownItem[];
    userInfo: any;
    statsItem: any;

    allAvailableTabItems = [
        { idx: 0, title: 'Agents', value: 'agents' },
        { idx: 1, title: 'Capabilities', value: 'capability' },
        { idx: 2, title: 'Topics', value: 'topic' },
        { idx: 3, title: 'Prompts', value: 'prompt' },
        { idx: 4, title: 'Knowledge', value: 'knowledge' },
        { idx: 5, title: 'Models', value: 'model' },
        { idx: 6, title: 'Tools', value: 'tool' }
    ]

    breadCrumbsAction = {
        isBreadCrumbActive: false,
        breadcrumb: [{
            label: "Agent Hub",
            index: 0
        }]
        // activeBreadCrumbsItem: "",
    }

    tabFilterOptions = {
        // showFilterOption: true,
        filter: false,
        showToggleAll: false,
        showHeader: false,
        options: [] as any[],
        showIconOnly: true,
        hamburgerIconUrl: '../../../assets/agent-hub/menu-hamnburger.svg',
        placeholder: "",
        optionLabel: "title",
        styleClass: "menu-hamburger mt-1",
        changeHandler: this.onFilterTabItem.bind(this)
    }

    searchFilterOptions = {
        showFilterOption: true,
        filter: false,
        showToggleAll: false,
        showHeader: false,
        options: [] as any[],
        placeholder: "All",
        optionLabel: "header",
        styleClass: "custom-multiselect"
    }

    showColumnFilterOption = {
        showFilterOption: true,
        filter: false,
        showToggleAll: false,
        showHeader: false,
        options: [],
        placeholder: "All",
        optionLabel: "header",
        styleClass: "showColumnFilterOption",
        changeHandler: this.onShowDynamicColumnFilter.bind(this)
    }

    constructor(
        private storageService: LocalStorageService,
        private agentHubService: AgentHubService
    ) {
        this.activeIndex = 0;
        this.columns = dynamicTableColumnData.dynamicTable.AgentHub[this.activeIndex].columns;

        /**
         * Get the column name for filter option 
         */

        this.tabItems = this.allAvailableTabItems;

        this.tabFilterOptions.options = this.tabItems

        this.showColumnFilterOption.options = this.columns?.map((item: any) => {
            return {
                idx: item.idx,
                header: item.header
            }
        })

        this.searchFilterOptions.options = [{
            idx: 0,
            header: "All"
        }, {
            idx: 1,
            header: "My Agents"
        }];

        this.statsItem = Constant.stats

        this.agentTabItemDropdown = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    // this.update();
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    // this.delete();
                }
            },
            // Additional dropdown items...
        ];

        this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
    }



    /**
     * Methods will be define from here
     */
    test(event: any): void {
        console.log("hello", event);
        // this.activeIndex = 0;
    }

    agentTabDropDownHandler() {
        if (this.activeIndex != 0) {
            this.activeIndex = 0;
            this.getAllAgentList();
        }
    }

    onShowDynamicColumnFilter(event: any) {
        if (!event?.value?.length) {
            this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex]?.columns
        } else {
            this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex].columns?.filter(item => event?.value?.some((valItem: { idx: number }) => valItem.idx === item.idx))
        }
    }

    onFilterTabItem(event: any) {
        if(!event?.value?.length) {
            this.tabItems = this.tabFilterOptions.options
        }else{
            this.tabItems = this.tabFilterOptions.options.filter(item => event?.value?.some((valItem: { idx: number }) => valItem.idx === item.idx))
        }

        this.getAllAgentList()
    }


    OnbreabCrumbsClickHandler(item: any) {
        this.breadCrumbsAction.isBreadCrumbActive = true;
        const newPayload = {
            label: item.label,
            index: this.breadCrumbsAction.breadcrumb.length
        };
        this.breadCrumbsAction.breadcrumb = [...this.breadCrumbsAction.breadcrumb, newPayload];

        this.getAllAgentList({endpoint: item.value})
    }

    goBackBreadCrumbsHandler(event: any) {
        // this.breadCrumbsAction.activeBreadCrumbsItem = ""
        const newItem = this.breadCrumbsAction.breadcrumb
        const indexToDelete = event.item.index + 1
        newItem.splice(indexToDelete)
        this.breadCrumbsAction.isBreadCrumbActive = false

        this.breadCrumbsAction.breadcrumb = [...newItem]
    }




    /**
     * NOTE: Async Operation
     */

    async getAllAgentList({endpoint=''} = {}) {
        this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub[this.activeIndex]?.columns
        endpoint = endpoint ? endpoint : this.tabItems[this.activeIndex].value
        this.tableData = []
        try {
            const response = await this.agentHubService.getAllAgent({ accountId: this.userInfo.account_id, endpoint: endpoint,page: 1, page_size: 10 });
            this.tableData = response.data as ITableDataEntry[];
        } catch (error) {
            console.error("Error fetching agent list:", error);
        }
    }


    async getAgentCount() {
        try{
            let query = {
                account_id: this.userInfo.account_id
            }
            const response = await this.agentHubService.getAgentCount({endpoint: 'agent', query })

            this.statsItem.forEach((element: any) => {
                element.count =  response.data[element.key]              
            });

        }catch(error){
            console.error("Error fetching agent list:", error);
        }
    }

}