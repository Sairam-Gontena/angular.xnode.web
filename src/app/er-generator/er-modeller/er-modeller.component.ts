import { AfterViewChecked, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Data } from '../class/data';
import { DataService } from '../service/data.service';
import { sampleData } from './sample-data';
import { JsPlumbService } from '../service/jsPlumb.service';

@Component({
  selector: 'xnode-er-modeller',
  templateUrl: './er-modeller.component.html',
  styleUrls: ['./er-modeller.component.scss']
})
export class ErModellerComponent implements AfterViewInit, AfterViewChecked, OnInit {
  data: Data | any;
  dashboard: any;
  layoutColumns: any;
  templates: any;
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;
  @Input() erModelInput: any;

  constructor(private dataService: DataService, private jsPlumbService: JsPlumbService) {
    this.data = this.dataService.data;
  }

  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
  }

  ngAfterViewChecked(): void {
    if (this.dataService.flg_repaint) {
      this.dataService.flg_repaint = false;
      this.jsPlumbService.repaintEverything();
    }
  }


  ngAfterViewInit(): void {
    this.jsPlumbService.init();
    this.dataService.loadData(sampleData);
  }

  getLayout(layout: any): void {
    console.log('layout', layout);
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }

  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }

}
