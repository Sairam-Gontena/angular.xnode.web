import { Component } from '@angular/core';

@Component({
  selector: 'xnode-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent {
  dashboard: any;
  layoutColumns: any;
  templates: any;
  selectedTemplate = localStorage.getItem("app_name");
  highlightedIndex: string | null = null;
  templatesOptions: any;
  templateEvent: any;
  dropdownSelectedValue: any;

  tableHeaders: string[] = ['Version', 'Deployed On', 'Deployed By', "Notes", "Status"];
  tableData: any[] = [
    {
      "Version": "3.0",
      "Deployed On": "2023-07-01",
      "Deployed By": "Address1",
      "Notes": 'thimma@gmail.comm',
      "Status": "pending"
    },
    {
      "Version": "2.0",
      "Deployed On": "2023-05-01",
      "Deployed By": "Address1",
      "Notes": 'thimma@gmail.comm',
      "Status": "deployed"

    },
    {
      "Version": "1.0",
      "Deployed On": "2023-04-01",
      "Deployed By": "Address1",
      "Notes": 'thimma@gmail.comm',
      "Status": "deployed"

    },
    {
      "Version": "0.1",
      "Deployed On": "2023-03-01",
      "Deployed By": "Address1",
      "Notes": 'thimma@gmail.comm',
      "Status": "deployed"

    },];



  ngOnInit(): void {
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ]
    this.templatesOptions = [
      { label: 'Preview' },
      { label: 'Publish' }

    ]
    this.dropdownSelectedValue = this.templatesOptions[0].label;
  }

  // ngAfterViewChecked(): void {
  //   if (this.dataService.flg_repaint) {
  //     this.dataService.flg_repaint = false;
  //     this.jsPlumbService.repaintEverything();
  //   }
  // }


  // ngAfterViewInit(): void {
  //   this.jsPlumbService.init();
  //   this.dataService.loadData(this.utilService.ToModelerSchema(this.erModelInput));
  // }

  getLayout(layout: any): void {
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }

  onDropdownOptionClick(event: any) {
    this.templateEvent = event.value.label;
    this.dropdownSelectedValue = this.templateEvent
  }

  navigateOnClick() {
    if (this.dropdownSelectedValue == 'Preview') {
      window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
    }
  }
}
