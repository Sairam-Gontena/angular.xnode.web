import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, of } from 'rxjs';
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
      data: this.overviewForm.value
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

  // Capability Add
  // capabilityAddHandler() {
  //   const formData = this.overviewForm.value
  //   const linkAgentInfo = formData?.agent
  //   const linkModel = formData?.model

  //   delete formData?.model
  //   delete formData?.agent

  //   formData["account_id"] = this.userInfo.account_id

  //   let urlPayload: any = {
  //     url: ("agent/create_capability"),
  //     data: this.overviewForm.value
  //   }
  //   this.utilsService.loadSpinner(true);
  //   this.agentHubService.postData(urlPayload).subscribe({
  //     next: async (response: any) => {
  //       if (response) {
  //         // await this.linkCapToAgent(response, linkAgentInfo)
  //         // await this.linkModelCapability(response, linkModel)

  //         await Promise.all([
  //           this.linkCapToAgent(response, linkAgentInfo),
  //           this.linkModelCapability(response, linkModel),
  //         ]);
  //       } else if (response?.detail) {
  //         this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
  //       }
  //     }, error: (error: any) => {
  //       this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
  //       this.utilsService.loadSpinner(false);
  //     }
  //   });
  // }



  capabilityAddHandler() {
    const formData = this.overviewForm.value;
    const linkAgentInfo = formData?.agent;
    const linkModel = formData?.model;

    // Remove model and agent from formData before sending it to the server
    delete formData.model;
    delete formData.agent;

    // Add account_id to formData
    formData["account_id"] = this.userInfo.account_id;

    let urlPayload: any = {
      url: "agent/create_capability",
      data: formData
    };

    this.utilsService.loadSpinner(true);
    this.agentHubService.postData(urlPayload).subscribe({
      next: (response: any) => {
        if (response) {
          // Create observables for linking capabilities
          const linkAgentObservable = this.linkCapToAgent(response, linkAgentInfo);
          const linkModelObservable = this.linkModelCapability(response, linkModel);

          // Use forkJoin to handle concurrent observable execution
          forkJoin([linkAgentObservable, linkModelObservable]).subscribe({
            next: () => {
              // Handle successful completion of both operations
            },
            error: (error: any) => {
              this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
            },
            complete: () => {
              this.utilsService.loadSpinner(false);
            }
          });
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
          this.utilsService.loadSpinner(false);
        }
      },
      error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
        this.utilsService.loadSpinner(false);
      }
    });
  }

  // async linkCapToAgent(capResponse: any, linkAgent: any) {

  // }

  // async linkModelCapability(capResponse: any, linkModel: any) {

  // }


  async linkCapToAgent(capResponse: any, linkAgentInfo: any) {
    if (!linkAgentInfo) return of(null); // RxJS 'of' to return an observable of null if no agent info

    const linkAgentPayload = {
      capability_id: capResponse.id,
      agent_id: linkAgentInfo,
      account_id: this.userInfo.account_id
    };


    let urlPayload: any = {
      url: "agent/create_agent_capability",
      data: linkAgentPayload
    };

    return this.agentHubService.postData(urlPayload);
  }

  async linkModelCapability(capResponse: any, linkModelInfo: any) {
    if (!linkModelInfo) return of(null); // RxJS 'of' to return an observable of null if no model info

    const linkModelPayload = {
      capability_id: capResponse.id,
      model_id: linkModelInfo,
      account_id: this.userInfo.account_id
    };

    let urlPayload: any = {
      url: "agent/create_model_capability",
      data: linkModelPayload
    };

    return this.agentHubService.postData(urlPayload);
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
