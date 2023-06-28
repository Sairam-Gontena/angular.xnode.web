import { AfterViewChecked, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Data } from '../class/data';
import { DataService } from '../service/data.service';
import { JsPlumbService } from '../service/jsPlumb.service';
import { UtilService } from '../service/util.service';
import { InputDataJson } from '../service/input_data_sample';
import { ApiService } from 'src/app/api/api.service';

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
  isOpen = true;
  id: String = '';
  email = 'admin@xnode.ai';
  testModel: any;
  @Input() erModelInput: any;

  constructor(private apiService: ApiService, private dataService: DataService, private jsPlumbService: JsPlumbService, private utilService: UtilService) {
    this.data = this.dataService.data;
  }

  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
    this.get_ID()
  }
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
  ngAfterViewChecked(): void {
    if (this.dataService.flg_repaint) {
      this.dataService.flg_repaint = false;
      this.jsPlumbService.repaintEverything();
    }
  }


  ngAfterViewInit(): void {
    // this.jsPlumbService.init();
    // this.dataService.loadData(this.utilService.ToModelerSchema(this.erModelInput));
  }

  getLayout(layout: any): void {
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }

  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }

  //get calls 
  get_ID() {
    this.apiService.getID(this.email)
      .then(response => {
        this.id = response.data.data[0].id;
        this.get_Usecases();
      })
      .catch(error => {
        console.log(error);
      });
  }

  get_Usecases() {
    this.apiService.getUsecase(this.email, this.id)
      .then(response => {
        this.testModel = response?.data?.data?.insights_data[0]?.DataModel;
        console.log('erModelInput', this.erModelInput);
        this.jsPlumbService.init();
        this.dataService.loadData(this.utilService.ToModelerSchema(this.testModel));

      })
      .catch(error => {
        console.log(error);
      });

  }

}
