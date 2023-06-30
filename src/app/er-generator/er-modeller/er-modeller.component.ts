import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { Data } from '../class/data';
import { DataService } from '../service/data.service';
import { JsPlumbService } from '../service/jsPlumb.service';
import { UtilService } from '../service/util.service';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'xnode-er-modeller',
  templateUrl: './er-modeller.component.html',
  styleUrls: ['./er-modeller.component.scss']
})

export class ErModellerComponent implements AfterViewChecked, OnInit {
  data: Data | any;
  dashboard: any;
  layoutColumns: any;
  templates: any;
  loading: boolean = true;
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;
  isOpen = true;
  id: String = '';
  email = 'admin@xnode.ai';
  dataModel: any;
  @Input() erModelInput: any;

  constructor(private apiService: ApiService, private dataService: DataService, private jsPlumbService: JsPlumbService, private utilService: UtilService) {
    this.data = this.dataService.data;
  }

  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
    this.getMeUserId()
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

  getLayout(layout: any): void {
    if (layout)
      this.dashboard = this.layoutColumns[layout];
  }

  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }

  //get calls 
  getMeUserId() {
    this.apiService.get("/get_metadata/" + this.email)
      .then(response => {
        if (response?.status === 200) {
          this.id = response.data.data[0].id;
          this.getMeDataModel();
        }
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
        this.loading = false;
      });
  }

  getMeDataModel() {
    this.apiService.get("/retrive_insights/" + this.email + "/" + '495ca64c-c0ba-4e78-9edf-8645650a0800')
      .then(response => {
        if (response?.status === 200) {
          const data = response?.data?.insights_data;
          this.dataModel = Array.isArray(data) ? data[0].DataModel : data.DataModel;
          this.jsPlumbService.init();
          this.dataService.loadData(this.utilService.ToModelerSchema(this.dataModel));
        }
      })
      .catch(error => {
        console.log(error);
      });

  }

 

}
