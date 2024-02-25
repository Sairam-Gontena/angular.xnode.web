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

    searchFilterOptions = {
        showFilterOption: true,
        filter: false,
        showToggleAll: false,
        showHeader: false,
        options: [],
        placeholder: "All",
        optionLabel: "name",
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

        this.showColumnFilterOption.options = this.columns?.map((item: any) => {
            return {
                idx: item.idx,
                header: item.header
            }
        })

        this.activeIndex = 0;
        this.tabItems = [
            { title: 'Agents', value: 'agent' },
            { title: 'Capabilities', value: 'capbility' },
            { title: 'Prompts', value: 'prompt' },
            { title: 'Knowledge', value: 'knowledge' },
            { title: 'Models', value: 'model' },
            { title: 'Tools', value: 'tools' }
        ];

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
      this.columns = dynamicTableColumnData?.dynamicTable?.AgentHub?.columns?.filter(item => event?.value?.some((valItem: {idx: number} )=> valItem.idx === item.idx))
    }
}