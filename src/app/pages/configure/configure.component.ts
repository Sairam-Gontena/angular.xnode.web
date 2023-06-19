import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {
  getconfigureLayout: any;
  layout: any;
  dashboard: any;
  layoutColumns: any;
  templates: any;
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;

  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
  }

  getLayout(layout: any): void {
    // console.log('layout', layout);
    // if (layout)
    //   this.dashboard = this.layoutColumns[layout];
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
