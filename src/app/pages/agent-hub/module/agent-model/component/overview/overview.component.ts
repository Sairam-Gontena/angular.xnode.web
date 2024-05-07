import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-model-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class ModelOverviewComponent {
  @Input() modelId: string | undefined;
  @Input() showBackButton = false
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();
  public overviewForm!: FormGroup;
  public overViewObj: any = {
    modelSelectionRadioArr: [{ name: 'Choose from existing provider', key: 'EXISTING_PROVIDER' },
    { name: 'Add model using URL Endpoint', key: 'URL_ENDPOINT' }],
    enableCreateModel: true,
    enableAdvanceOption: false,
    getModelID: "",
    currentUser: "",
    formEditable: false,
    componentDetail: {
      componentType: "",
      enableDialog: false,
      header: ""
    }
  }

  constructor(private formBuilder: FormBuilder,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private activatedRoute: ActivatedRoute,
    private agentHubService: AgentHubService,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService) {
    this.overViewObj.getModelID = this.modelId ?? this.activatedRoute.snapshot.paramMap.get('id');
    this.overviewForm = this.formBuilder.group({
      name: [''],
      description: [''],
      temperature: [''],
      max_context_length: [''],
      modelSelection: ['EXISTING_PROVIDER'],
      model: [''],
      version: ['']
    });
    if (this.overViewObj.getModelID) {
      this.overViewObj.enableCreateModel = false;
      this.overviewForm.disable();
    } else {

    }
  }

  ngOnInit() {
    this.overViewObj.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    this.checkCreateEditModel();
  }

  //checking create and edit in model
  checkCreateEditModel() {
    if (this.dynamicDialogConfig.data) {
      this.overViewObj.componentDetail = this.dynamicDialogConfig.data;
      this.overViewObj.componentDetail.enableDialog = true;
      if (this.dynamicDialogConfig.data.componentType === "CREATE") {

      }
    } else {
      this.getModelDetailByID(); //get model detail by modelID
    }
  }

  //get model detail by modelID
  getModelDetailByID() {
    let urlParam: any = {
      url: ("/agent/model_by_id/" + (this.modelId ?? this.activatedRoute.snapshot.paramMap.get('id')))
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.getModelDetailByID(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.overviewForm.patchValue({
            name: response?.name,
            description: response?.description,
            temperature: response?.temperature,
            max_context_length: response?.max_context_length
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

  modelOverviewSubmit() {
    let urlPayload: any = {
      ID: "",
      payload: this.overviewForm.value
    },
      getCreateUpdateModelDetail: any;
    // this.utilsService.loadSpinner(true);
    if (this.overViewObj.enableCreateModel) {
      // getCreateUpdateModelDetail = this.agentHubService.createTopicDetail(urlPayload.payload);
    } else {
      urlPayload.ID = this.overViewObj.getModelID;
      // getCreateUpdateModelDetail = this.agentHubService.updateTopicDetailByID(urlPayload)
    }
    debugger
    // if (!getCreateUpdateModelDetail) {
    //   return this.utilsService.loadSpinner(false);
    // }

    // getCreateUpdateModelDetail.subscribe({
    //   next: (response: any) => {
    //     if (response) {
    //     }
    //     this.utilsService.loadSpinner(false);
    //   }, error: (error: any) => {
    //     this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
    //     this.utilsService.loadSpinner(false);
    //   }
    // });
  }

  showHideAdvanceOption() {
    this.overViewObj.enableAdvanceOption = !this.overViewObj.enableAdvanceOption;
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
