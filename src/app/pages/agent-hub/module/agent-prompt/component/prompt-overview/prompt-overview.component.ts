import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';



enum ParentType {
  Capability = 'capability',
  Topic = 'topic'
}
@Component({
  selector: 'xnode-prompt-overview-instruction',
  templateUrl: './prompt-overview.component.html',
  styleUrls: ['./prompt-overview.component.scss']
})
export class PromptOverviewComponent {
  @Input() promptId!: string;
  @Input() showBackButton = false
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();
  public overviewForm!: FormGroup;
  public overViewObj: any = {
    promptData: "",
    formEditable: false,
    componentDetail: {
      componentType: "",
      enableDialog: false,
      header: ""
    }
  }

  public enableAdvancedOtion: boolean = false;

  agentInfo: any;
  selectedLinkParentType: ParentType = ParentType.Capability
  parentLinkOptionList = []

  parentLinkTabsItem = [
    { idx: 1, title: 'Capabilities', value: 'capabilities_linked_agents', identifier: ParentType.Capability },
    { idx: 2, title: 'Topics', value: 'topic', identifier: ParentType.Topic },
  ]
  activeIndex = 0;
  userInfo: any;

  display: boolean = false

  constructor(private formBuilder: FormBuilder,
    private storageService: LocalStorageService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private activatedRoute: ActivatedRoute,
    private agentHubService: AgentHubService,
    private utilsService: UtilsService) {

    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);

    this.overviewForm = this.formBuilder.group({
      category: [""],
      source: [""],
      name: [""],
      description: [""],
      instruction: [""],
      initialConversationStarter: [''],
      starter: [[]],
      key: [''],
      value: [''],
      key_value: [[]],
      opening_message: [""],
      concluding_message: [""],
      linkParent: [""],
      guideline: [''],
      responsibility: [''],
      context: [''],
      example: ['']
    });
    // this.overviewForm.disable();
  }

  ngOnInit() {
    this.promptId = this.promptId ?? this.activatedRoute.snapshot.paramMap.get('id')
    if (this.dynamicDialogConfig.data) {
      // Modal
      this.overViewObj.componentDetail = this.dynamicDialogConfig.data;
      this.overViewObj.componentDetail.enableDialog = true;
    } else {
      // Overview
      this.overviewForm.disable();
      this.getPrompDetailByID(); //get topic detail by topicID
    }

    this.getAllAgentList()
  }

  //get topic detail by topicID
  getPrompDetailByID() {
    let urlParam: any = {
      url: ("/agent/prompt_by_id/" + this.promptId)
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.getAgentDetail(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.agentInfo = response
          this.overViewObj.promptData = response
          this.overviewForm.patchValue({
            name: response?.name,
            description: response?.description,
            category: response?.category,
            source: response?.source,
            instruction: response?.instruction,
            // initialConversationStarter: response?.initialConversationStarter,
            starter: response?.starter != "" ? JSON.stringify(response?.starter) : [],
            // key: response?.key,
            // value: response?.value,
            key_value: response?.key_value != "" ? JSON.stringify(response?.key_value) : [],
            opening_message: response?.opening_message,
            concluding_message: response?.concluding_message,
            linkParent: response?.linkParent,
            guideline: response?.guideline,
            responsibility: response?.responsibility,
            context: response?.context,
            example: JSON.stringify(response?.example)
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

  getAllAgentList() {
    this.parentLinkOptionList = []
    const endpoint = this.parentLinkTabsItem[this.activeIndex].value
    // try {
    //   const response = await this.agentHubService.getAllAgent({
    //     accountId: this.userInfo.account_id,
    //     endpoint: endpoint,
    //     page: 1,
    //     page_size: 10,
    //   });

    //   this.parentLinkOptionList = response.data.data

    // } catch (error) {
    //   console.error('Error fetching agent list:', error);
    // }


    let url: string = `/agent/${endpoint}/${this.userInfo.account_id}`,
      urlParam: any = {
        url: url,
        params: {
          // accountId: this.userInfo.account_id,
          // endpoint: endpoint,
          page: 1,
          page_size: 10,
        }
      }
    this.utilsService.loadSpinner(true);

    this.agentHubService.getAllAgent(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.parentLinkOptionList = response.data.data;
          // this.paginatorInfo.page = response.data.page;
          // this.paginatorInfo.perPage = response.data.per_page;
          // this.paginatorInfo.totalRecords = response.data.total_items;
          // this.paginatorInfo.totalPages = response.data.total_pages;
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
        this.utilsService.loadSpinner(false);
      }
    })
  }

  //topic oversubmit
  promptOverviewSubmit() {
    const formData = this.overviewForm.value

    formData.version = this.agentInfo?.version
    let urlPayload: any = {
      url: ("/agent/update_prompt/" + this.promptId) + `/${this.agentInfo?.version}`,
      data: formData
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.updateData(urlPayload).subscribe({
      next: (response: any) => {
        if (response) {
          this.overviewForm.patchValue({
            name: response?.name,
            description: response?.description,
            category: response?.category,
            source: response?.source,
            instruction: response?.instruction,
            // initialConversationStarter: response?.initialConversationStarter,
            starter: response?.starter != "" ? JSON.stringify(response?.starter) : [],
            // key: response?.key,
            // value: response?.value,
            key_value: response?.key_value != "" ? JSON.stringify(response?.key_value) : [],
            opening_message: response?.opening_message,
            concluding_message: response?.concluding_message,
            linkParent: response?.linkParent,
            guideline: response?.guideline,
            responsibility: response?.responsibility,
            context: response?.context,
            example: response?.example
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

  submitPromptHandler() {
    console.log(this.overviewForm.value);
    const formData = this.overviewForm.value
    // this.onClose();

    const starterArray = formData?.starter;
    const starterArrayString = JSON.stringify(starterArray);

    formData.starter = starterArrayString

    if (formData.key && formData.value) {
      formData.key_value.push({
        [formData.key]: formData?.value
      })
    }

    formData.key_value = JSON.stringify(formData.key_value)


    const linkParent = formData.linkParent

    delete formData.linkParent

    // Below field should be handled by Backend.
    formData["status"] = "training"

    formData["account_id"] = this.userInfo.account_id

    console.log(linkParent, formData, "linkParent")

    let urlParam = {
      url: 'agent/create_prompt',
      data: formData
    }

    let promptResponse: any;

    /**
     * Create Prompt Request.
     */
    this.utilsService.loadSpinner(true);
    this.agentHubService.postData(urlParam).subscribe({
      next: (response: any) => {
        console.log("responseData", response)
        promptResponse = response

        this.linkParent(promptResponse, linkParent)
        // this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        console.log("responseData", error)
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
        this.utilsService.loadSpinner(false);
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
    //     this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
    //     this.utilsService.loadSpinner(false);
    //   }
    // })
  }

  linkParent(promptResponse: any, linkParent: any) {
    let urlParam: any = {}
    /**
     * Link promot to parent
     */

    urlParam.data = {
      account_id: this.userInfo.account_id,
      prompt_id: promptResponse?.data?.prompt_id // Need to check proper response object.
    }

    if (this.selectedLinkParentType == ParentType.Capability) {
      urlParam.url = '/agent/create_capability_prompt'

      urlParam.data.capability_id = linkParent.id
    } else {
      urlParam.url = '/agent/create_prompt_topic'

      urlParam.data.topic_id = linkParent.id
    }


    this.agentHubService.postData(urlParam).subscribe({
      next: (response: any) => {
        console.log("responseData", response)
        promptResponse = response
      }, error: (error: any) => {
        console.log("responseData", error)
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
        this.utilsService.loadSpinner(false);
      }
    })
  }

  //show and hide advanced Option
  showHideAdvancedOption() {
    this.enableAdvancedOtion = !this.enableAdvancedOtion;
  }

  addStarterValue() {
    const value = this.overviewForm.get('initialConversationStarter')?.value?.trim(); // Trim any leading/trailing whitespace
    if (value) {
      const starterArray = this.overviewForm.get('starter')?.value;
      starterArray.push(value);
      this.overviewForm.patchValue({
        starter: starterArray
      });
      this.overviewForm.get('initialConversationStarter')?.setValue('')// Clear the input field
    }
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  addKeyValue() {
    const key = this.overviewForm.get('key')?.value?.trim();
    const value = this.overviewForm.get('value')?.value?.trim();
    if (key && value) {
      const keyValueArray = this.overviewForm.get('key_value')?.value;
      keyValueArray.push({
        [key]: value
      });

      this.overviewForm.patchValue({
        key_value: keyValueArray
      });

      this.overviewForm.get('key')?.setValue('')// Clear the input field
      this.overviewForm.get('value')?.setValue('')// Clear the input field

    }
  }

  onLinkParentChangeHandler(event: any) {
    console.log("he;;", event)
    if (this.activeIndex == 0) {
      this.selectedLinkParentType = ParentType.Capability
    } else {
      this.selectedLinkParentType = ParentType.Topic
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

  onCompareClickHandler() {
    this.display = true
  }
}
