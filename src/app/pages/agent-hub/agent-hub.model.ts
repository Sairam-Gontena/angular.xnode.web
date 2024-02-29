/**
 * Represents the model for the Agent Hub page.
 */
import { LocalStorageService } from "src/app/components/services/local-storage.service";
import dynamicTableColumnData from "../../../assets/json/dynamictabledata.json";
import { IDropdownItem, ITableDataEntry, ITableInfo } from "./IAgent-hub";
import { AgentHubService } from "src/app/api/agent-hub.service";
import { StorageKeys } from "src/models/storage-keys.enum";

export class AgentHubModel {
    columns: any; // Define the type of columns based on the actual data structure
    activeIndex: number;
    tabItems: { title: string, value: string }[];
    tableData!: ITableDataEntry[];
    tableInfo: ITableInfo;
    agentTabItemDropdown: IDropdownItem[];
    userInfo: any;

    allAvailableTabItems = [
        { title: 'Agents', value: 'agent' },
        { title: 'Capabilities', value: 'capbility' },
        { title: 'Prompts', value: 'prompt' },
        { title: 'Knowledge', value: 'knowledge' },
        { title: 'Models', value: 'model' },
        { title: 'Tools', value: 'tools' }
    ]

    breadCrumbsAction = {
        isBreadCrumbActive: false,
        activeBreadCrumbsItem: "",
    }

    tabFilterOptions = {
        showFilterOption: true,
        filter: false,
        showToggleAll: false,
        showHeader: false,
        options: [] as any[],
        showIconOnly: true,
        hamburgerIconUrl: '../../../assets/agent-hub/menu-hamnburger.svg',
        placeholder: "",
        optionLabel: "title",
        styleClass: "menu-hamburger"
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
        this.columns = dynamicTableColumnData.dynamicTable.AgentHub.columns;

        /**
         * Get the column name for filter option 
         */

        this.activeIndex = 0;
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
        }]

        this.tableInfo = {
            delete_action: false,
            export_action: false,
            name: "Notification List",
            search_input: true
        };
        
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

    async getAllAgentList() {
        this.tableData = []
        try {
            const response = await this.agentHubService.getAllAgent({ accountId: this.userInfo.account_id, endpoint: this.tabItems[this.activeIndex].value });
            this.tableData = response.data as ITableDataEntry[];
        } catch (error) {
            console.error("Error fetching agent list:", error);
        }
    }

    onShowDynamicColumnFilter(event: any) {
        if(!event?.value.length) {
            this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub?.columns 
        }else {
            this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub?.columns?.filter(item => event?.value?.some((valItem: {idx: number} )=> valItem.idx === item.idx))
        }
    }


    OnbreabCrumbsClickHandler(val: string) {
        this.breadCrumbsAction.isBreadCrumbActive = true,
        this.breadCrumbsAction.activeBreadCrumbsItem = val
    }

    goBackBreadCrumbsHandler(){
        this.breadCrumbsAction.activeBreadCrumbsItem = ""
        this.breadCrumbsAction.isBreadCrumbActive = false
    }
}