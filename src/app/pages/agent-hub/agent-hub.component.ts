import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AgentHubModel } from './agent-hub.model';

@Component({
  selector: 'xnode-agent-hub',
  templateUrl: './agent-hub.component.html',
  styleUrls: ['./agent-hub.component.scss']
})
export class AgentHubComponent implements OnInit {

  agentHubModel: AgentHubModel;  
  // dropdownSelection: string = '';

  // dropdownItems = [
  //   { label: 'Agents', value: 'Agent1' },
  //   { label: 'Agents 2 6 8 0 8 9 7 6 5 ', value: 'Agent2' },
  //   // more options...
  // ];

  // selectTab(tabIndex: number) {
  //   this.selectedTab = tabIndex;
  // }

  // onDropdownChange(event: any) {
  //   this.dropdownSelection = event.value;
  //   // this.selectedTab = null; // Or a specific value that doesn't match any tab index
  // }


  ngOnInit() {}

  // allColumns: any[] = [
  //   { name: 'Australia', code: 'AU' },
  //   { name: 'Brazil', code: 'BR' },
  //   { name: 'China', code: 'CN' },
  //   { name: 'Egypt', code: 'EG' },
  //   { name: 'France', code: 'FR' },
  //   { name: 'Germany', code: 'DE' },
  //   { name: 'India', code: 'IN' },
  //   { name: 'Japan', code: 'JP' },
  //   { name: 'Spain', code: 'ES' },
  //   { name: 'United States', code: 'US' }
  // ];
  // selectedColumns: any[] = [];

  constructor() {
    // Set default columns to display
    // this.selectedColumns = [...this.allColumns];

    this.agentHubModel = new AgentHubModel()
  }

}

