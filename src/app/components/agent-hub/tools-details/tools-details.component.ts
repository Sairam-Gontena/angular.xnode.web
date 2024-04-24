import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { BreadCrumbsAction } from './ITools-details';
import { LocalStorageService } from '../../services/local-storage.service';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { UtilsService } from '../../services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'xnode-tools-details',
  templateUrl: './tools-details.component.html',
  styleUrls: ['./tools-details.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsDetailsComponent {
  @Input() rowViewData = {
    showDetail: false,
    showHeader: true,
    showTab: true,
    requestedId: ''
  }
  @Input() showToolModal!: boolean;
  @Output() showToolModalChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() agentInfo: any;
  overviewForm!: FormGroup;
  tabItems: { idx: number; title: string; value: string, identifier: string }[] = [
    { idx: 0, title: 'Overview', value: 'overview', identifier: 'overview' },
    // { idx: 1, title: 'Actions', value: 'action', identifier: 'actions' },
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
          command: () => { this.showToolModalChange.emit(true) },
        },
      ],
    },
    // Action: {
    //   buttonText: 'Action',
    //   options: [
    //     {
    //       label: 'Add a Tool',
    //       icon: '',
    //       command: () => { },
    //     },
    //   ],
    // }
  };

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

  @Input() formEditable = false;
  @Output() onEditSave = new EventEmitter<{ event: any }>();

  constructor(private storageService: LocalStorageService,
    private agentHubService: AgentHubService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.userInfo = this.storageService.getItem(StorageKeys.CurrentUser);


    this.overviewForm = this.formBuilder.group({
      description: [''],
      name: [''],
      actions: ['']
    })
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes?.agentInfo?.currentValue) {
      this.overviewForm.patchValue({
        name: this.agentInfo.name,
        description: this.agentInfo.description,
        actions: this.agentInfo.action
      });
    }
    if (changes.formEditable) {
      if (this.formEditable) {
        this.overviewForm.enable();
      } else {
        this.overviewForm.disable();
      }
    }
  }

  goBackBreadCrumbsHandler(event: any) {

    // NOTE: Need to update this for tools. This is just dummy purpose.

    // this.breadCrumbsAction.activeBreadCrumbsItem = ""
    const newItem = this.breadCrumbsAction.breadcrumb;
    const indexToDelete = event.item.index + 1;
    newItem.splice(indexToDelete);
    this.breadCrumbsAction.isBreadCrumbActive = false;

    if (event?.item?.path) {
      this.router.navigate([event.item.path]);
    }

    this.breadCrumbsAction.breadcrumb = [...newItem];
  }

  onEditSaveHandler() {
    this.onEditSave.emit(this.overviewForm?.value)
  }
}
