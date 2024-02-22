import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'xnode-agent-hub',
  templateUrl: './agent-hub.component.html',
  styleUrls: ['./agent-hub.component.scss']
})
export class AgentHubComponent implements OnInit{
  items:{ title: string}[] = [];
  activeIndex = 0;

  columns = [
    {
      field: "id",
      filter: false,
      header: "Id",
      sortable: true,
      width: '10rem'
    },
    {
      field: "agent",
      filter: false,
      header: "Agent Name",
      sortable: true,
      width: '10rem'
    },

    {
      field: "description",
      filter: false,
      header: "Description",
      sortable: true,
      width: '20rem'
    },
    {
      field: "state",
      filter: false,
      header: "State",
      sortable: true,
      width: '8rem'
    },
    {
      field: "status",
      filter: false,
      header: "Status",
      sortable: true,
      width: '8rem'
    },
    {
      field: "createdBy",
      filter: false,
      header: "Created By",
      sortable: true,
      width: '12rem'
    },

    {
      field: "action-btn",
      filter: false,
      header: "",
      sortable: true,
      width: '10rem',
    }
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

  dropdown = [
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






  selectedTab: number | null = 1;
dropdownSelection: string = '';

  dropdownItems = [
    {label: 'Agents', value: 'Agent1'},
    {label: 'Agents 2 6 8 0 8 9 7 6 5 ', value: 'Agent2'},
    // more options...
  ];
  
  selectTab(tabIndex: number) {
    this.selectedTab = tabIndex;
  }
  
  onDropdownChange(event:any) {
    this.dropdownSelection = event.value;
    this.selectedTab = null; // Or a specific value that doesn't match any tab index
  }

  test(s: string) {
    console.log("hello",s)

    this.activeIndex=0
  }
  ngOnInit() {
    this.items =[
      { title: 'Agents' },
      { title: 'Capabilities' },
      { title: 'Prompts' },

      { title: 'Knowledge' },
      { title: 'Models' },
      { title: 'Tools' }
  ];

  }

//   allColumns: any[] = [
//     {
//         label: 'Germany',
//         value: 'de',
//         items: [
//             { label: 'Berlin', value: 'Berlin' },
//             { label: 'Frankfurt', value: 'Frankfurt' },
//             { label: 'Hamburg', value: 'Hamburg' },
//             { label: 'Munich', value: 'Munich' }
//         ]
//     },
//     {
//         label: 'USA',
//         value: 'us',
//         items: [
//             { label: 'Chicago', value: 'Chicago' },
//             { label: 'Los Angeles', value: 'Los Angeles' },
//             { label: 'New York', value: 'New York' },
//             { label: 'San Francisco', value: 'San Francisco' }
//         ]
//     },
//     {
//         label: 'Japan',
//         value: 'jp',
//         items: [
//             { label: 'Kyoto', value: 'Kyoto' },
//             { label: 'Osaka', value: 'Osaka' },
//             { label: 'Tokyo', value: 'Tokyo' },
//             { label: 'Yokohama', value: 'Yokohama' }
//         ]
//     }
// ];


allColumns: any[] = [
  { name: 'Australia', code: 'AU' },
  { name: 'Brazil', code: 'BR' },
  { name: 'China', code: 'CN' },
  { name: 'Egypt', code: 'EG' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'India', code: 'IN' },
  { name: 'Japan', code: 'JP' },
  { name: 'Spain', code: 'ES' },
  { name: 'United States', code: 'US' }
];
selectedColumns: any[] = [];

constructor() {
    // Set default columns to display
    this.selectedColumns = [...this.allColumns];
}
}

