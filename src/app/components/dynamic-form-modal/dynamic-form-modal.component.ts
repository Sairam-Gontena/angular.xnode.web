import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { agentName } from 'src/app/pages/agent-hub/agent-hub.constant';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

enum ParentType {
  Capability = 'capability',
  Topic = 'topic'
}

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
  selectedLinkParentType: ParentType = ParentType.Capability

  userInfo: any;

  constructor(private formBuilder: FormBuilder, private storageService: LocalStorageService,  private agentHubService: AgentHubService) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
    

    this.createPromptForm = this.formBuilder.group({
      name: [""],
      description: [""],
      instruction: [""],
      initialConversationStarter: [''],
      starter: [[]],
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
      identifier: ParentType.Capability,
    },
    { idx: 2, title: 'Topics', value: 'topic', identifier: ParentType.Topic },
  ]
  activeIndex = 0;

  

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

  addStarterValue() {
    const value = this.createPromptForm.get('initialConversationStarter')?.value?.trim(); // Trim any leading/trailing whitespace
    if (value) {
      const starterArray = this.createPromptForm.get('starter')?.value;
      starterArray.push(value);
      this.createPromptForm.patchValue({
        starter: starterArray
      });
      this.createPromptForm.get('initialConversationStarter')?.setValue('')// Clear the input field
    }
  }

  onClose() {
    this.displayChange.emit(false);
  }

  onSubmit() {
    console.log(this.createPromptForm.value);
    const formData = this.createPromptForm.value
    // this.onClose();

    const starterArray = formData?.starter;
    const starterArrayString = JSON.stringify(starterArray);

    formData.starter = starterArrayString


    const linkParent = formData.linkParent

    delete formData.linkParent

    console.log(linkParent, formData, "linkParent")

    let urlParam = {
      url : 'agent/create_prompt',
      data: formData
    }

    let promptResponse:any;

    /**
     * Create Prompt Request.
     */
    this.agentHubService.postData(urlParam).subscribe({
      next: (response: any) => {
        console.log("responseData", response)
        promptResponse = response
      }, error: (error: any) => {
        console.log("responseData", error)
      }
    })


    /**
     * Link promot to parent
     */

    urlParam.data = {
      account_id: this.userInfo.account_id,
      prompt_id: promptResponse?.data?.prompt_id // Need to check proper response object.
    }

    if(this.selectedLinkParentType == ParentType.Capability) {
      urlParam.url = 'agent/create_capability_prompt'

      urlParam.data.capability_id =  linkParent.id
    }else {
      urlParam.url = 'agent/create_prompt_topic'

      urlParam.data.topic_id =  linkParent.id
    }


    this.agentHubService.postData(urlParam).subscribe({
      next: (response: any) => {
        console.log("responseData", response)
        promptResponse = response
      }, error: (error: any) => {
        console.log("responseData", error)
      }
    })

  }

  onLinkParentChangeHandler(event: any){
    console.log("he;;", event)
    if(this.activeIndex == 0) {
      this.selectedLinkParentType = ParentType.Capability
    }else {
      this.selectedLinkParentType = ParentType.Topic
    }

  }
}
