import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Data } from '../../pages/er-modeller/class/data';
import { Router } from '@angular/router';
import { DataService } from '../../pages/er-modeller/service/data.service';
import { JsPlumbService } from '../../pages/er-modeller/service/jsPlumb.service';
import { UtilService } from '../../pages/er-modeller/service/util.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-data-model-common',
  templateUrl: './data-model-common.component.html',
  styleUrls: ['./data-model-common.component.scss'],
  providers: [DataService, JsPlumbService, UtilService, MessageService],
})

export class DataModelCommonComponent {
  @Input() dataModelData: any;
  @Input() erModelInput: any;
  @Input() dataToExpand: any;
  @Input() specExpanded?: boolean;
  @Output() dataFlowEmitter = new EventEmitter<any>();
  data: Data | any;
  bpmnSubUrl: boolean = false;
  dashboard: any;
  layoutColumns: any;
  loading: boolean = true;
  highlightedIndex: string | null = null;
  isOpen = true;
  currentUser?: any;
  dataModel: any;
  product: any;
  currentUrl: string = '';

  constructor(
    private dataService: DataService,
    private jsPlumbService: JsPlumbService,
    private utilService: UtilService,
    private router: Router,
    private storageService: LocalStorageService,
    private utilsService: UtilsService,
  ) {
    this.data = this.dataService.data;
    console.log(' this.data', this.data);

    this.router.events.subscribe((data: any) => {
      this.router.url == '/configuration/data-model/x-bpmn'
        ? (this.bpmnSubUrl = true)
        : (this.bpmnSubUrl = false);
    });
  }

  ngOnInit(): void {
    console.log('dataModelData', this.dataModelData);

    this.currentUrl = this.router.url;
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    if (!this.product?.has_insights) {
      this.utilsService.showProductStatusPopup(true);
      return;
    }
    setTimeout(() => {
      const list: any = this.storageService.getItem(StorageKeys.SpecData);
      this.dataModel = this.dataModelData.content;
      this.jsPlumbService.init();
      this.dataService.loadData(this.utilService.ToModelerSchema(this.dataModel));
    }, 100)
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
    if (layout) this.dashboard = this.layoutColumns[layout];
  }

  expandDataFlows(): void {
    this.dataFlowEmitter.emit(this.dataToExpand);
  }
}
