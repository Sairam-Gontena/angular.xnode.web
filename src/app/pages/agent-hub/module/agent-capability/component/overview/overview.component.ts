import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-capability-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class CapabilityOverviewComponent {
  @Input() capabilityId: string | undefined;
  @Input() showBackButton = false
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();
  userInfo: any;
  public overviewForm!: FormGroup;
  public overViewObj: any = {
    formEditable: false,
    componentDetail: {
      componentType: "",
      enableDialog: false,
      header: ""
    }
  }

  agentOptionList = {
    optionList: [],
    page: 1,
    perPage: 10,
    totalPages: 0
  }

  modelOptionList = {
    optionList: [],
    page: 1,
    perPage: 10,
    totalPages: 0
  }

  constructor(private formBuilder: FormBuilder,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private activatedRoute: ActivatedRoute,
    private agentHubService: AgentHubService,
    private utilsService: UtilsService,
    private storageService: LocalStorageService,
  ) {
    this.overviewForm = this.formBuilder.group({
      name: [''],
      description: [''],
      model: [''],
      agent: [''],

    });

    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
    // this.overviewForm.disable();
  }

  ngOnInit() {
    if (this.dynamicDialogConfig.data) {
      // Modal
      this.overViewObj.componentDetail = this.dynamicDialogConfig.data;
      this.overViewObj.componentDetail.enableDialog = true;
    } else {
      /** Overview */
      this.overviewForm.disable();
    }
    this.getCapabilityDetailByID(); //get capability detail by capabilityID

    this.getModelList()
    this.getAgentList()
  }

  //get capability detail by capabilityID
  getCapabilityDetailByID() {
    let urlParam: any = {
      url: ("/agent/capbility_by_id/" + (this.capabilityId ?? this.activatedRoute.snapshot.paramMap.get('id')))
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.getAgentDetail(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.overviewForm.patchValue({
            name: response?.name,
            description: response?.description,
            model: response?.model,
            agent: response?.agent
          });
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
        this.utilsService.loadSpinner(false);
      }
    });
  }

  async getAgentList() {
    let endpoint = '/agents'
    try {
      const response = await this.agentHubService.getAllAgent({
        accountId: this.userInfo.account_id,
        endpoint: endpoint,
        page: this.agentOptionList.page,
        page_size: this.agentOptionList.perPage,
      });

      this.agentOptionList.optionList = response.data.data

    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  }

  async getModelList() {
    let endpoint = '/model'
    try {
      const response = await this.agentHubService.getAllAgent({
        accountId: this.userInfo.account_id,
        endpoint: endpoint,
        page: this.agentOptionList.page,
        page_size: this.agentOptionList.perPage,
      });

      this.modelOptionList.optionList = response.data.data

    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  }

  //capability Edit
  capabilityOverviewSubmit() {
    let urlPayload: any = {
      url: ("/agent/update_capability/" + (this.capabilityId ?? this.activatedRoute.snapshot.paramMap.get('id'))),
      payload: this.overviewForm.value
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.updateData(urlPayload).subscribe({
      next: (response: any) => {
        if (response) {
          this.overviewForm.patchValue({
            name: response?.name,
            description: response?.description,
            model: response?.model,
            agent: response?.agent
          });
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
        this.utilsService.loadSpinner(false);
      }
    });
  }

  //on edit save event
  onEditSaveEvent() {
    this.overViewObj.formEditable = !this.overViewObj.formEditable;
    this.overViewObj.formEditable ? this.overviewForm.enable() : this.overviewForm.disable();
  }

  //on close event
  onCloseEvent() {
    let eventTypeData: any = { eventType: "CLOSE" };
    this.dynamicDialogRef.close(eventTypeData);
  }

  //on cancel event
  onCancelEvent() {
    let eventTypeData: any = { eventType: "CANCEL" };
    this.dynamicDialogRef.close(eventTypeData);
  }
  onGoBackHandler() {
    this.goBack.emit(false)
  }
}
