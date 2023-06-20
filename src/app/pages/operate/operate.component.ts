import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-operate',
  templateUrl: './operate.component.html',
  styleUrls: ['./operate.component.scss']
})
export class OperateComponent implements OnInit {
  getconfigureLayout: any;
  layout: any;
  dashboard: any  = 'Overview';
  layoutColumns: any;
  templates: any;
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;
  operateLayout: any;

  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
  }

  getLayout(layout: any): void {
    console.log(layout);
    this.dashboard = layout;
    // if (layout)
    //   this.dashboard = this.layoutColumns[layout];
    //   console.log(layout)
  }

  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
  }

  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }

}
