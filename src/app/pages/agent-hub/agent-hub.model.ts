import dynamicTableColumnData from "../../../assets/json/dynamictabledata.json"

export class AgentHubModel {
    columns = dynamicTableColumnData.dynamicTable.AgentHub.columns;
    activeIndex = 0;
    items = [
        { title: 'Agents' },
        { title: 'Capabilities' },
        { title: 'Prompts' },
  
        { title: 'Knowledge' },
        { title: 'Models' },
        { title: 'Tools' }
      ];
      tableData = [
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
        },
      ]

      tableInfo = {
        delete_action: false,
        export_action: false,
        name: "Notification List",
        search_input: true
      }

      agentTabItemDropdown = [
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
        // { label: 'Angular.io', icon: 'pi pi-info', url: 'http://angular.io' },
        // { separator: true },
        // { label: 'Installation', icon: 'pi pi-cog', routerLink: ['/installation'] }
      ];
    constructor () {}



    /**
     * Methods define here
     */

    test(s: string) {
        console.log("hello", s)
    
        this.activeIndex = 0
      }
}