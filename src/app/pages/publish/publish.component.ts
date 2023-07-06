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
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;

  tableHeaders: string[] = ['Version', 'Deployed On', 'Deployed By',"Notes","Status"];
  tableData: any[] =[
    {
      "Version":"3.0",
      "Deployed On":"2023-07-01",
      "Deployed By":"Address1",
      "Notes":'thimma@gmail.comm',
      "Status":"pending"
    },
    {
      "Version":"2.0",
      "Deployed On":"2023-05-01",
      "Deployed By":"Address1",
      "Notes":'thimma@gmail.comm',
      "Status":"deployed"

    },
    {
      "Version":"1.0",
      "Deployed On":"2023-04-01",
      "Deployed By":"Address1",
      "Notes":'thimma@gmail.comm',
      "Status":"deployed"

    },
    {
      "Version":"0.1",
      "Deployed On":"2023-03-01",
      "Deployed By":"Address1",
      "Notes":'thimma@gmail.comm',
      "Status":"deployed"

    },];



  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
  }



  getLayout(layout: any): void {
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }

  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }

}
