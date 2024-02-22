/**
 * Represents the model for the Agent Hub page.
 */
import dynamicTableColumnData from "../../../assets/json/dynamictabledata.json";
import { IDropdownItem, ITableDataEntry, ITableInfo } from "./IAgent-hub";

export class AgentHubModel {
    columns: any; // Define the type of columns based on the actual data structure
    activeIndex: number;
    tabItems: { title: string }[];
    tableData: ITableDataEntry[];
    tableInfo: ITableInfo;
    agentTabItemDropdown: IDropdownItem[];

    constructor() {
        this.columns = dynamicTableColumnData.dynamicTable.AgentHub.columns;
        this.activeIndex = 0;
        this.tabItems = [
            { title: 'Agents' },
            { title: 'Capabilities' },
            { title: 'Prompts' },
            { title: 'Knowledge' },
            { title: 'Models' },
            { title: 'Tools' }
        ];
        this.tableData = [
            {
                id: "AGID002",
                agent: "Navi v1.0",
                description: "Navi is a conversational assistant dedicated to lorem lupsum lorem lupsum",
                state: "live",
                status: "Active",
                createdBy: "Anurag",
                "action-btn": "..."
            },
            {
                id: "AGID002",
                agent: "Navi v1.0",
                description: "Navi is a conversational assistant dedicated to lorem lupsum lorem lupsum",
                state: "live",
                status: "Active",
                createdBy: "Anurag",
                "action-btn": "..."
            },
            {
                id: "AGID002",
                agent: "Navi v1.0",
                description: "Navi is a conversational assistant dedicated to lorem lupsum lorem lupsum",
                state: "live",
                status: "Active",
                createdBy: "Anurag",
                "action-btn": "..."
            },
            {
                id: "AGID002",
                agent: "Navi v1.0",
                description: "Navi is a conversational assistant dedicated to lorem lupsum lorem lupsum",
                state: "live",
                status: "Active",
                createdBy: "Anurag",
                "action-btn": "..."
            },
            {
                id: "AGID002",
                agent: "Navi v1.0",
                description: "Navi is a conversational assistant dedicated to lorem lupsum lorem lupsum",
                state: "live",
                status: "Active",
                createdBy: "Anurag",
                "action-btn": "..."
            },
            {
                id: "AGID002",
                agent: "Navi v1.0",
                description: "Navi is a conversational assistant dedicated to lorem lupsum lorem lupsum",
                state: "live",
                status: "Active",
                createdBy: "Anurag",
                "action-btn": "..."
            },
            {
                id: "AGID002",
                agent: "Navi v1.0",
                description: "Navi is a conversational assistant dedicated to lorem lupsum lorem lupsum",
                state: "live",
                status: "Active",
                createdBy: "Anurag",
                "action-btn": "..."
            }
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
    }



    /**
     * Methods will be define from here
     */
    test(s: string): void {
        console.log("hello", s);
        this.activeIndex = 0;
    }
}