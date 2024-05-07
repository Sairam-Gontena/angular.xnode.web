import { Component, Input, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { Constant } from 'src/app/pages/agent-hub/agent-hub.constant';
import { StorageKeys } from 'src/models/storage-keys.enum';

interface ControlValidator {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
  nullValidator?: boolean;
}

interface FormControlConfig {
  name: string;
  value: any;
  validators: ControlValidator;
}

@Component({
  selector: 'xnode-agent-overview',
  templateUrl: './agent-overview.component.html',
  styleUrls: ['./agent-overview.component.scss']
})
export class AgentOverviewComponent implements OnInit {
  @Input() formType = 'overview';
  @Input() agentInfo!: any;

  agentInfoDtlObj: any;
  overviewForm!: FormGroup;
  instructionForm!: FormGroup;
  userInfo: any;
  statsItem = Constant.stats;
  instructionOption = [{ name: "General Instructions", value: "general_instruction" },
  { name: "Capability Specific Instructions", value: "capability_specific_instruction" }];

  enableGeneralInstruction: boolean = true;
  categoryNameCountArr: Array<any> = [{ categoryIcon: "", categoryName: "Capabilities", count: "2" },
  { categoryIcon: "", categoryName: "Topics", count: "4" },
  { categoryIcon: "", categoryName: "Prompts", count: "8" },
  { categoryIcon: "", categoryName: "Knowledge", count: "2" },
  { categoryIcon: "", categoryName: "Models", count: "1" },
  { categoryIcon: "", categoryName: "Tools", count: "2" }]

  // @Input() overviewInstructionDetail!: any;
  // @Input() formStyle!: string;
  // @Input() fieldClass!: string;
  // @Input() labelClass!: string;
  // @Input() inputClass!: string;

  // @Input() formEditable!: boolean;

  // @Output() onEditSave = new EventEmitter<{ event: any }>(); 

  overviewInstructionDetailObj: any;

  constructor(private storageService: LocalStorageService, private formBuilder: FormBuilder, private agentHubService: AgentHubService, private activatedRoute: ActivatedRoute, private utilsService: UtilsService) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);


    //overview form
    this.overviewForm = this.formBuilder.group({
      description: [''],
      tags: ['']
    })
    //instruction form
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
    this.getAgentCount();
  }

  //overview form submit
  onOverviewSubmit() {
    console.log(this.overviewForm.value);
  }

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
    let url: string = "/agent/count_by_id/",
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
          element.count = response[element.key];
        });

        console.log(response, "response")
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
      }
    });
  }
}