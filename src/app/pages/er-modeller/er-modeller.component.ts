import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { Data } from './class/data';
import { DataService } from './service/data.service';
import { JsPlumbService } from './service/jsPlumb.service';
import { UtilService } from './service/util.service';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'xnode-er-modeller',
  templateUrl: './er-modeller.component.html',
  styleUrls: ['./er-modeller.component.scss'],
  providers: [DataService, JsPlumbService, UtilService, MessageService],
})

export class ErModellerComponent implements AfterViewChecked, OnInit {
  data: Data | any;
  dashboard: any;
  layoutColumns: any;
  templates: any;
  loading: boolean = true;
  selectedTemplate = localStorage.getItem("app_name");
  highlightedIndex: string | null = null;
  isOpen = true;
  id: String = '';
  currentUser?: User;
  dataModel: any;
  @Input() erModelInput: any;

  constructor(private apiService: ApiService, private messageService: MessageService, private dataService: DataService, private jsPlumbService: JsPlumbService, private utilService: UtilService) {
    this.data = this.dataService.data;
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ]
    if (localStorage.getItem('record_id') === null) {
      this.getMeUserId();
    } else {
      this.getMeDataModel();
    }
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


  //get calls 
  getMeUserId() {
    this.apiService.get("/get_metadata/" + this.currentUser?.email)
      .then(response => {
        if (response?.status === 200) {
          this.id = response.data.data[0].id;
          localStorage.setItem('record_id', response.data.data[0].id)
          this.getMeDataModel();
        }
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
        this.showToast('error', error.message, error.code);
        this.loading = false;
      });
  }

  getMeDataModel() {
    this.dataModel = null;
    this.apiService.get("/retrive_insights/" + this.currentUser?.email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.dataModel = Array.isArray(data.data_model) ? data.data_model[0] : data.data_model;
          this.jsPlumbService.init();
          this.dataService.loadData(this.utilService.ToModelerSchema(this.dataModel));
        }
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
        this.showToast('error', error.message, error.code);
        this.loading = false;
      });
  }
  showToast(severity: string, message: string, code: string) {
    this.messageService.clear();
    this.messageService.add({ severity: severity, summary: code, detail: message, sticky: true });
  }
}
