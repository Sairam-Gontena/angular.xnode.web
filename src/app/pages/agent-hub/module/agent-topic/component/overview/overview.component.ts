import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class TopicOverviewComponent {
  public overviewForm!: FormGroup;
  public overViewObj: any = {
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
    private utilsService: UtilsService) {
    this.overviewForm = this.formBuilder.group({
      name: [''],
      description: [''],
      parentCapability: ['']
    });
    this.overviewForm.disable();
  }

  ngOnInit() {
    if (this.dynamicDialogConfig.data) {
      this.overViewObj.componentDetail = this.dynamicDialogConfig.data;
      this.overViewObj.componentDetail.enableDialog = true;
    }
    this.getTopicDetailByID(); //get topic detail by topicID
  }

  //get topic detail by topicID
  getTopicDetailByID() {
    let urlParam: any = {
      url: ("agent/topic_by_id/" + this.activatedRoute.snapshot.paramMap.get('id'))
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
      url: ("agent/update_topic/" + this.activatedRoute.snapshot.paramMap.get('id')),
      payload: this.overviewForm.value
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.updateTopicDetailByID(urlPayload).subscribe({
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

}
