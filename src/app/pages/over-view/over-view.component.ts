import { Component } from '@angular/core';
import * as jdata from '../../constants/overview.json'
@Component({
  selector: 'xnode-over-view',
  templateUrl: './over-view.component.html',
  styleUrls: ['./over-view.component.scss']
})
export class OverViewComponent {
  jsondata: any;
  templates: any;
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;
  iconClicked: any;
  item: any;


  ngOnInit(): void {
    this.jsondata = jdata?.data;
    console.log(this.jsondata);

    this.templates = [
      { label: 'FinBuddy' }
    ]
  }
  ;
  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
    this.iconClicked.emit(icon);
  }
  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }
}

