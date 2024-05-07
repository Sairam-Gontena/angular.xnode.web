import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-tool-overview',
  templateUrl: './tool-overview.component.html',
  styleUrls: ['./tool-overview.component.scss']
})
export class ToolOverviewComponent {
  @Input() toolId: string | undefined;
  @Input() showBackButton = false
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();
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
      name: ['', Validators.required],
      description: ['', Validators.required],
      select_scheme: ['import', Validators.required],
      tool_url: [''],
      schema: ['']
    });
    // this.overviewForm.disable();
  }

  ngOnInit() {
    if (this.dynamicDialogConfig.data) {
      // Modal
      this.overViewObj.componentDetail = this.dynamicDialogConfig.data;
      this.overViewObj.componentDetail.enableDialog = true;
    } else {
      // Overview
      this.getToolDetailByID(); //get tool detail by toolID

      this.overviewForm.disable();
    }
  }

  //get tool detail by toolID
  getToolDetailByID() {
    let urlParam: any = {
      url: ("/agent/tool_by_id/" + (this.toolId ?? this.activatedRoute.snapshot.paramMap.get('id')))
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.getAgentDetail(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.overviewForm.patchValue({
            name: response?.name,
            description: response?.description,
            select_scheme: response?.select_scheme,
            tool_url: response?.tool_url,
            schema: response?.schema
          });
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error?.detail });
        this.utilsService.loadSpinner(false);
      }
    });
  }

  //tool oversubmit
  toolOverviewSubmit() {
    let urlPayload: any = {
      url: ("/agent/update_tool/" + (this.toolId ?? this.activatedRoute.snapshot.paramMap.get('id'))),
      payload: this.overviewForm.value
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.updateData(urlPayload).subscribe({
      next: (response: any) => {
        if (response) {
          this.overviewForm.patchValue({
            name: response?.name,
            description: response?.description,
            select_scheme: response?.select_scheme,
            tool_url: response?.tool_url,
            schema: response?.schema
          });
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error?.detail });
        this.utilsService.loadSpinner(false);
      }
    });
  }

  // Method to submit form
  submitToolHandler() {
    if (this.overviewForm.valid) {
      console.log('Form submitted successfully!', this.overviewForm?.value);
    }
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
