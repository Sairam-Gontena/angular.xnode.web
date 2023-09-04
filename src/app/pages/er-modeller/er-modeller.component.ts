import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { Data } from './class/data';
import { Router } from '@angular/router';
import { DataService } from './service/data.service';
import { JsPlumbService } from './service/jsPlumb.service';
import { UtilService } from './service/util.service';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
@Component({
  selector: 'xnode-er-modeller',
  templateUrl: './er-modeller.component.html',
  styleUrls: ['./er-modeller.component.scss'],
  providers: [DataService, JsPlumbService, UtilService, MessageService],
})

export class ErModellerComponent implements AfterViewChecked, OnInit {
  data: Data | any;
  bpmnSubUrl: boolean = false;
  dashboard: any;
  layoutColumns: any;
  loading: boolean = true;
  selectedTemplate = localStorage.getItem("app_name");
  highlightedIndex: string | null = null;
  isOpen = true;
  id: String = '';
  currentUser?: User;
  dataModel: any;
  product: any;
  product_id: any;
  @Input() erModelInput: any;

  constructor(private apiService: ApiService,
    private dataService: DataService, private jsPlumbService: JsPlumbService,
    private utilService: UtilService, private router: Router,
    private utilsService: UtilsService) {
    this.data = this.dataService.data;
    this.currentUser = UserUtil.getCurrentUser();
    this.router.events.subscribe((data: any) => {
      this.router.url == "/configuration/data-model/x-bpmn" ? this.bpmnSubUrl = true : this.bpmnSubUrl = false;
    });
  }

  ngOnInit(): void {
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
      this.product_id = JSON.parse(product).id;
    }
    if (this.product && !this.product?.has_insights) {
      this.utilsService.showProductStatusPopup(true);
      return
    }
    this.utilsService.loadSpinner(true);
    this.getMeDataModel();
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
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch(error => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilsService.loadSpinner(false)
      });
  }

  getMeDataModel() {
    this.dataModel = null;
    this.apiService.get("/retrive_insights/" + this.currentUser?.email + "/" + this.product_id)
      .then(response => {
        if (response?.status === 200) {
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.dataModel = Array.isArray(data.data_model) ? data.data_model[0] : data.data_model;
          this.jsPlumbService.init();
          this.dataService.loadData(this.utilService.ToModelerSchema(this.dataModel));
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
          this.utilsService.showProductStatusPopup(true);
        }
        this.utilsService.loadSpinner(false);
      })
      .catch(error => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilsService.loadSpinner(false);
      });
  }
}
