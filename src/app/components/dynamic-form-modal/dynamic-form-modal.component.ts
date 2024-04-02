import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { agentName } from 'src/app/pages/agent-hub/agent-hub.constant';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-dynamic-form-modal',
  templateUrl: './dynamic-form-modal.component.html',
  styleUrls: ['./dynamic-form-modal.component.scss']
})
export class DynamicFormModalComponent implements OnInit {
  @Input() heading!: string;
  @Input() subHeading!: string;
  @Input() display: boolean = false;
  // @Input() promptData!: any;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public createPromptForm!: FormGroup;
  public enableAdvancedOtion: boolean = false;

  userInfo: any;

  constructor(private formBuilder: FormBuilder, private storageService: LocalStorageService,  private agentHubService: AgentHubService) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
    

    this.createPromptForm = this.formBuilder.group({
      name: [""],
      description: [""],
      instruction: [""],
      starter: [""],
      linkParent: [""],
      guideline: [''],
      responsibility: [''],
      context: [''],
      example: ['']
    });
  }


  parentLinkOptionList = []

  parentLinkTabsItem = [
    {
      idx: 1,
      title: 'Capabilities',
      value: 'capabilities_linked_agents',
      identifier: agentName.capability,
    },
    { idx: 2, title: 'Topics', value: 'topic', identifier: agentName.topic },
  ]
  activeIndex = 0;

  // onTabSwitchHandler(event: any) {
    
  // }

  async getAllAgentList() {
   this.parentLinkOptionList = []
   const endpoint = this.parentLinkTabsItem[this.activeIndex].value
    try {
      const response = await this.agentHubService.getAllAgent({
        accountId: this.userInfo.account_id,
        endpoint: endpoint,
        page: 1,
        page_size: 10,
      });

      this.parentLinkOptionList = response.data.data
     
    } catch (error) {
      console.error('Error fetching agent list:', error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['promptData']?.currentValue) {
      // this.promptData = changes['promptData']?.currentValue;
      // this.createPromptForm.patchValue({
      //   name: this.promptData.name,
      //   description: this.promptData.description,
      //   instructions: this.promptData.instruction,
      //   conversationStarters: "",
      //   linkParent: this.promptData.parent
      // })
    }
  }

  async ngOnInit(): Promise<void> {

    await this.getAllAgentList()
  }

  //show and hide advanced Option
  showHideAdvancedOption() {
    this.enableAdvancedOtion = !this.enableAdvancedOtion;
  }

  onClose() {
    this.displayChange.emit(false);
  }

  onSubmit() {
    console.log(this.createPromptForm.value);
    // this.onClose();
  }
}
