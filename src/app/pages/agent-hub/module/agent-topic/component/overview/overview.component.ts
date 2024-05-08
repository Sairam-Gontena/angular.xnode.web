import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { InitialPaginatorInfo } from 'src/app/pages/agent-hub/constant/agent-hub';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class TopicOverviewComponent {
  @Input() topicId: string | undefined;
  @Input() showBackButton = false
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();
  public overviewForm!: FormGroup;
  public overViewObj: any = {
    enableCreateTopic: true,
    getTopicID: "",
    currentUser: "",
    formEditable: false,
    capabilityLinkedAgentOption: new Array(),
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
    this.overViewObj.getTopicID = this.topicId ?? this.activatedRoute.snapshot.paramMap.get('id');
    this.overviewForm = this.formBuilder.group({
      name: [''],
      description: [''],
      parentCapability: [''],
      parent_topic_id: ['']
    });
    if (this.overViewObj.getTopicID) {
      this.overViewObj.enableCreateTopic = false;
      this.overviewForm.removeControl("parent_topic_id");
      this.overviewForm.disable();
    } else {
      this.overviewForm.removeControl("parentCapability");
      this.overviewForm.addControl("parent_topic_id", new FormControl(''));
    }
  }

  ngOnInit() {
    this.overViewObj.currentUser = this.localStorageService.getItem(StorageKeys.CurrentUser);
    this.checkCreateEditTopic();
  }

  //making the url param for category
  makeTableParamObj() {
    let urlParam: any = {
      url: "/agent/capabilities_linked_agents/" + this.overViewObj.currentUser.account_id
    };
    return urlParam;
  }

  //checking create and edit in topic
  checkCreateEditTopic() {
    if (this.dynamicDialogConfig.data) {
      this.overViewObj.componentDetail = this.dynamicDialogConfig.data;
      this.overViewObj.componentDetail.enableDialog = true;
      if (this.dynamicDialogConfig.data.componentType === "CREATE") {
        this.overviewForm.removeControl("parentCapability");
        this.overviewForm.addControl("parent_topic_id", new FormControl(''));
      }
      let urlParam = this.makeTableParamObj();
      this.getParentLinkOption(urlParam);
    } else {
      this.getTopicDetailByID(); //get topic detail by topicID
    }
  }

  //get all capabilities by agent
  getParentLinkOption(urlParam: any) {
    this.utilsService.loadSpinner(true);
    this.agentHubService.getCapabilitiesByAgent(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.overViewObj.capabilityLinkedAgentOption = ((response?.data) ? response.data : new Array());
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
        this.utilsService.loadSpinner(false);
      }
    });
  }

  //get topic detail by topicID
  getTopicDetailByID() {
    let urlParam: any = {
      url: ("/agent/topic_by_id/" + (this.topicId ?? this.activatedRoute.snapshot.paramMap.get('id')))
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.getTopicDetailByID(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.overviewForm.patchValue({
            name: response?.name,
            description: response?.description,
            parentCapability: response?.idx
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

  //topic oversubmit
  topicOverviewSubmit() {
    let urlPayload: any = {
      ID: "",
      payload: this.overviewForm.value
    },
      getCreateUpdateTopicDetail: any;
    this.utilsService.loadSpinner(true);
    if (this.overViewObj.enableCreateTopic) {
      getCreateUpdateTopicDetail = this.agentHubService.createTopicDetail(urlPayload.payload);
    } else {
      urlPayload.ID = this.overViewObj.getTopicID;
      getCreateUpdateTopicDetail = this.agentHubService.updateTopicDetailByID(urlPayload);
    }

    if (!getCreateUpdateTopicDetail) {
      return this.utilsService.loadSpinner(false);
    }
    getCreateUpdateTopicDetail.subscribe({
      next: (response: any) => {
        if (response) {
          this.overviewForm.patchValue({
            name: response?.name,
            description: response?.description,
            parentCapability: response?.idx
          });
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
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
