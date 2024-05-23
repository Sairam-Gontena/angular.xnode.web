import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { Constant } from 'src/app/pages/agent-hub/agent-hub.constant';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-agent-overview',
  templateUrl: './agent-overview.component.html',
  styleUrls: ['./agent-overview.component.scss']
})
export class AgentOverviewComponent implements OnInit {
  @Input() formType = 'overview';
  @Input() agentInfo!: any;

  public overViewObj: any = {
    agentData: "",
    formEditable: false,
  }

  agentInfoDtlObj: any;
  overviewForm!: FormGroup;
  instructionForm!: FormGroup;
  userInfo: any;
  statsItem = Constant.agentDetail.stats;
  instructionOption = [{ name: "General Instructions", value: "general_instruction" },
  { name: "Capability Specific Instructions", value: "capability_specific_instruction" }];

  enableGeneralInstruction: boolean = true;

  // overviewInstructionDetailObj: any;

  constructor(private storageService: LocalStorageService, private formBuilder: FormBuilder, private agentHubService: AgentHubService, private activatedRoute: ActivatedRoute, private utilsService: UtilsService) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);


    //overview form
    // this.overviewForm = this.formBuilder.group({
    //   description: [''],
    //   tags: ['']
    // })
    // instruction form
    this.instructionForm = this.formBuilder.group({
      name: [''],
      role: [''],
      description: [''],
      instruction: [''],
      general_task: [''],
      specific_instruction: [''],
      missing_information: [''],
      answer_format: ['']
    });
    this.instructionForm.patchValue({
      instruction: this.instructionOption[0]
    });
  }

  ngOnInit() {
    this.overViewObj.agentData = this.agentInfo
    this.instructionForm.patchValue({
      name: this.agentInfo?.name,
      description: this.agentInfo?.description,
      role: this.agentInfo?.role,
      instruction: this.agentInfo?.instruction ?? this.instructionOption[0],
      general_task: this.agentInfo?.general_task,
      specific_instruction: this.agentInfo?.specific_instruction,
      missing_information: this.agentInfo?.missing_information,
      answer_format: this.agentInfo?.answer_format
    })
    this.getAgentCount();
  }

  //overview form submit
  // onOverviewSubmit() {
  //   console.log(this.overviewForm.value);
  // }

  //instruction form submit
  onInstructionSubmit() {
    console.log(this.instructionForm.value);
  }

  //on change instruction dropdown event
  onChangeInstruction(event: DropdownChangeEvent) {
    if (event.value && event.value.value === "general_instruction") {
      this.enableGeneralInstruction = true;
    } else if (event.value && event.value.value === "capability_specific_instruction") {
      this.enableGeneralInstruction = false;
    }
  }


  onEditSaveHandler() {

  }

  // Async Call
  async getAgentCount() {
    let url: string = "/agent/count_by_id",
      urlParam: any = {
        url: url,
        params: {
          account_id: this.userInfo.account_id,
          input_id: this.activatedRoute.snapshot.paramMap.get('id'),
          input_id_type: 'agent'
        }
      }

    this.agentHubService.getAgentCount(urlParam).subscribe({
      next: (response: any) => {
        this.statsItem.forEach((element: any) => {
          element.count = response[element.key] ?? 'N/A';
        });

        console.log(response, "response")
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error?.detail });
      }
    });
  }


  //get agent detail by agentId
  // getAgentDetailByID() {
  //   let urlParam: any = {
  //     url: ("/agent/agent_by_id/" + this.activatedRoute.snapshot.paramMap.get('id'))
  //   }
  //   this.utilsService.loadSpinner(true);
  //   this.agentHubService.getAgentDetail(urlParam).subscribe({
  //     next: (response: any) => {
  //       if (response) {
  //         this.overViewObj.agentData = response
  //         this.instructionForm.patchValue({
  //           name: response?.name,
  //           description: response?.description,
  //           role: response?.role,
  //           instruction: response?.instruction ?? this.instructionOption[0],
  //           general_task: response?.general_task,
  //           specific_instruction: response?.specific_instruction,
  //           missing_information: response?.missing_information,
  //           answer_format: response?.answer_format
  //         });
  //       } else if (response?.detail) {
  //         this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
  //       }
  //       this.utilsService.loadSpinner(false);
  //     }, error: (error: any) => {
  //       this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
  //       this.utilsService.loadSpinner(false);
  //     }
  //   });
  // }
}
