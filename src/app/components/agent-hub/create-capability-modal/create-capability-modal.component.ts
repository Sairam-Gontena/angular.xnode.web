import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { StorageKeys } from 'src/models/storage-keys.enum';


@Component({
  selector: 'xnode-create-capability-modal',
  templateUrl: './create-capability-modal.component.html',
  styleUrls: ['./create-capability-modal.component.scss']
})
export class CreateCapabilityModalComponent {
  @Input() heading!: string;
  @Input() subHeading!: string;
  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public createCapabilityForm!: FormGroup;
  userInfo: any;

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

  constructor(private formBuilder: FormBuilder, private storageService: LocalStorageService, private agentHubService: AgentHubService) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);


    this.createCapabilityForm = this.formBuilder.group({
      name: [""],
      description: [""],
      model: [""],
      agent: [''],
    });
  }


  // parentLinkOptionList = []

  // parentLinkTabsItem = [
  //   {
  //     idx: 1,
  //     title: 'Capabilities',
  //     value: 'capabilities_linked_agents',
  //     identifier: ParentType.Capability,
  //   },
  //   { idx: 2, title: 'Topics', value: 'topic', identifier: ParentType.Topic },
  // ]
  // activeIndex = 0;



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


  async ngOnInit(): Promise<void> {

    // NOTE: Will refactor the code and change it to Observalble.
    this.getAgentList()
    this.getModelList()
  }

  // //show and hide advanced Option
  // showHideAdvancedOption() {
  //   this.enableAdvancedOtion = !this.enableAdvancedOtion;
  // }

  // addStarterValue() {
  //   const value = this.createPromptForm.get('initialConversationStarter')?.value?.trim(); // Trim any leading/trailing whitespace
  //   if (value) {
  //     const starterArray = this.createPromptForm.get('starter')?.value;
  //     starterArray.push(value);
  //     this.createPromptForm.patchValue({
  //       starter: starterArray
  //     });
  //     this.createPromptForm.get('initialConversationStarter')?.setValue('')// Clear the input field
  //   }
  // }

  // getObjectKeys(obj: any): string[] {
  //   return Object.keys(obj);
  // }

  // addKeyValue() {
  //   const key = this.createPromptForm.get('key')?.value?.trim();
  //   const value = this.createPromptForm.get('value')?.value?.trim();
  //   if (key && value) {
  //     const keyValueArray = this.createPromptForm.get('key_value')?.value;
  //     keyValueArray.push({
  //       [key]: value
  //     });

  //     this.createPromptForm.patchValue({
  //       key_value: keyValueArray
  //     });

  //     this.createPromptForm.get('key')?.setValue('')// Clear the input field
  //     this.createPromptForm.get('value')?.setValue('')// Clear the input field

  //   }
  // }

  onClose() {
    this.displayChange.emit(false);
  }

  onSubmit() {
    console.log(this.createCapabilityForm.value);
    const formData = this.createCapabilityForm.value
    // this.onClose();



    // Below field should be handled by Backend.
    formData["status"] = "training"

    formData["account_id"] = this.userInfo.account_id

    let urlParam = {
      url: 'agent/create_capability',
      data: formData
    }

    let promptResponse: any;

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


    // /**
    //  * Link promot to parent
    //  */

    // urlParam.data = {
    //   account_id: this.userInfo.account_id,
    //   prompt_id: promptResponse?.data?.prompt_id // Need to check proper response object.
    // }

    // if (this.selectedLinkParentType == ParentType.Capability) {
    //   urlParam.url = 'agent/create_capability_prompt'

    //   urlParam.data.capability_id = linkParent.id
    // } else {
    //   urlParam.url = 'agent/create_prompt_topic'

    //   urlParam.data.topic_id = linkParent.id
    // }


    // this.agentHubService.postData(urlParam).subscribe({
    //   next: (response: any) => {
    //     console.log("responseData", response)
    //     promptResponse = response
    //   }, error: (error: any) => {
    //     console.log("responseData", error)
    //   }
    // })

  }

  // onLinkParentChangeHandler(event: any) {
  //   console.log("he;;", event)
  //   if (this.activeIndex == 0) {
  //     this.selectedLinkParentType = ParentType.Capability
  //   } else {
  //     this.selectedLinkParentType = ParentType.Topic
  //   }

  // }
}
