import { Component, Input, OnInit } from '@angular/core';
import { agentName } from 'src/app/pages/agent-hub/agent-hub.constant';
import { BreadCrumbsAction, CapabilitiesTableData, IPaginatorInfo, IQueryParams, ITableDataEntry, ITableInfo } from './ITools-details';
import { LocalStorageService } from '../../services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { TabViewChangeEvent } from 'primeng/tabview';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'xnode-tools-details',
  templateUrl: './tools-details.component.html',
  styleUrls: ['./tools-details.component.scss']
})
export class ToolsDetailsComponent implements OnInit {
  @Input() rowViewData = {
    showDetail: false,
    showHeader: true,
    showTab: true,
    requestedId: ''
  }
  agentInfo: any;
  overviewForm!: FormGroup;
  tabItems: { idx: number; title: string; value: string, identifier: string }[] = [
    { idx: 0, title: 'Overview', value: 'overview', identifier: 'overview' },
    { idx: 1, title: 'Actions', value: 'action', identifier: 'actions' },
  ];

  activeIndex: number = 0;
  userInfo: any;

  headerActionBtnOption = {
    overview: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add a Tool',
          icon: '',
          command: () => { },
        },
      ],
    },
    Action: {
      buttonText: 'Action',
      options: [
        {
          label: 'Add a Tool',
          icon: '',
          command: () => { },
        },
      ],
    }
  };

  activeHeaderActionBtnOption!: any[];

  breadCrumbsAction: BreadCrumbsAction = {
    isBreadCrumbActive: false,
    breadcrumb: [
      {
        label: 'Agent Hub',
        index: 0,
        path: '/agent-playground'
      },
    ],
    // activeBreadCrumbsItem: "",
  };

  currentActiveRowData: any;
  overviewInstructionForm: any = {
    enableOverview: false,
    enableInstruction: false,
    overviewInstructionData: ""
  };



  isFormEditable = false;

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);
  }

  ngOnInit() {
    this.overviewForm = this.formBuilder.group({
      description: [''],
      tags: ['']
    })
    this.getToolsDetailsById()
  }
  pdateHeaderOption() {
    let item = this.tabItems[this.activeIndex];
    if (item.identifier in this.headerActionBtnOption) {
      this.activeHeaderActionBtnOption =
        this.headerActionBtnOption[
          item.identifier as keyof typeof this.headerActionBtnOption
        ].options;
    } else {
      console.error('Invalid identifier:', item.identifier);
      // Handle the error appropriately
    }
  }

  // tab event
  onTabSwitchHandler(event: TabViewChangeEvent) {

  }

  //overview form submit
  onOverviewSubmit() {
    console.log(this.overviewForm.value);
  }

  //  get the agent details by Id
  getToolsDetailsById() {
    let url: string = "agent/tool_by_id/",
      getID: any = this.rowViewData.requestedId,
      urlParam: any = {
        url: url + getID,
        params: {}
      }

    this.agentHubService.getAgentDetail(urlParam).subscribe({
      next: (response: any) => {
        // this.getAgentDetailByCategorySuccess(response);
        this.agentInfo = response
        console.log(response, "response")
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error?.detail });
      }
    });
  }


  goBackBreadCrumbsHandler(event: any) {
    // this.breadCrumbsAction.activeBreadCrumbsItem = ""
    const newItem = this.breadCrumbsAction.breadcrumb;
    const indexToDelete = event.item.index + 1;
    newItem.splice(indexToDelete);
    this.breadCrumbsAction.isBreadCrumbActive = false;

    if (event?.item?.path) {
      this.router.navigate([event.item.path]);
    }

    // Show viewALl button
    // this.viewAll.showButton = !this.breadCrumbsAction.isBreadCrumbActive;

    this.breadCrumbsAction.breadcrumb = [...newItem];
  }
  onEditSaveHandler() {
    // const activeTab = this.tabItems[this.activeIndex].identifier

    // if (this.isFormEditable) {
    //   let urlParam = {
    //     url: '',
    //     data: {}
    //   }

    //   if (activeTab == agentName.prompt) {
    //     const id = formData?.id

    //     delete formData?.id
    //     urlParam.url = `agent/update_prompt/${id}/${formData.version}`
    //     urlParam.data = formData
    //   }


    //   this.agentHubService.updateData(urlParam).subscribe({
    //     next: (response: any) => {
    //       console.log("responseData", response)
    //     }, error: (error: any) => {
    //       console.log("responseData", error)
    //     }
    //   })
    // }


    // this.isFormEditable = !this.isFormEditable

  }
}
