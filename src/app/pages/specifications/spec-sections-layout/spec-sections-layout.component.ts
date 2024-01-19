import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SECTION_VIEW_CONFIG } from '../section-view-config';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { environment } from 'src/environments/environment';
import { delay, of } from 'rxjs';

declare const SwaggerUIBundle: any;
@Component({
  selector: 'xnode-spec-sections-layout',
  templateUrl: './spec-sections-layout.component.html',
  styleUrls: ['./spec-sections-layout.component.scss'],
})
export class SpecSectionsLayoutComponent implements OnInit, AfterViewInit {
  @Input() content: any;
  @Input() searchTerm: any;
  @Input() sectionIndex!: number;
  @Input() specItem: any;
  @Input() readOnly!: boolean;
  @Input() targetUrl: string = '';
  @Input() isOpenSmallCommentBox!: boolean;
  @Input() usersList: any = [];
  @Input() reveiwerList: any;

  // @Input() useCases: any[] = [];
  @Input() selectedSpecItem: any;
  @Input() specItemList: any;
  @Input() expandView: any;
  @Output() getCommentsAfterUpdate = new EventEmitter<any>();
  @Output() onClickSeeMore = new EventEmitter<any>();
  @Output() onClickSeeLess = new EventEmitter<any>();
  @Output() showAddCommnetOverlay = new EventEmitter<any>();
  @Output() expandComponent = new EventEmitter<any>();
  @Output() childLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  bpmnFrom: string = 'SPEC';
  iframeSrc: SafeResourceUrl = '';
  paraViewSections = SECTION_VIEW_CONFIG.paraViewSections;
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;
  selectedContent: any;
  smallCommentContent: any;
  showMoreContent: any;
  checked: boolean = false;
  currentUser: any;
  product: any;
  seletedMainIndex?: number;
  selecteedSubIndex?: number;
  selecteedSubSubIndex?: number;
  showCommentIcon?: boolean;
  commentOverlayPanelOpened: boolean = false;
  isDockedNaviOpened?: boolean = false;
  isSideMenuOpened?: boolean = false;
  isCommnetsPanelOpened?: boolean = false;
  jsonTypes = ['Business Rules', 'Annexures', 'User Interfaces', 'Functional Dependencies', 'Data Dictionary']

  businessRulesPanelOpened: boolean = false;
  businessRulesshowCommentIcon: boolean = false;
  dataDictionaryshowCommentIcon: boolean = false;
  dataDictionaryPanelOpened: boolean = false;
  functionalDependenciesshowCommentIcon: boolean = false;
  functionalDepedencyPanelOpened: boolean = false;
  userInterfacePanelOpened: boolean = false;
  userInterfaceshowCommentIcon: boolean = false;
  AnnexuresPanelOpened: boolean = false;
  AnnexureshowCommentIcon: boolean = false;
  usecasePanelOpened: boolean = false;
  usecaseshowCommentIcon: boolean = false;
  dataManagementPanelOpened: boolean = false;
  dataManagementCommentIcon: boolean = false;
  workflowPanelOpened: boolean = false;
  workflowshowCommentIcon: boolean = false;
  userinterfaceShowCommentIcon: boolean = false;
  userinterfacePanelOpened: boolean = false;
  userpersonaShowCommentIcon: boolean = false;
  usepersonaPanelOpened: boolean = false;
  qashowCommentIcon: boolean = false;
  qaPanelOpened: boolean = false;
  openAPIShowCommentIcon: boolean = false;
  openAPIPanelOpened: boolean = false;
  stakeHolderPanelOpened: boolean = false;
  stakeHoldershowCommentIcon: boolean = false;
  versionControlPanelOpened: boolean = false;
  versionControlshowCommentIcon: boolean = false;
  historicalDataPanelOpened: boolean = false;
  historicalDatashowCommentIcon: boolean = false;
  dataQualityPanelOpened: boolean = false;
  dataQualityshowCommentIcon: boolean = false;
  testCasePanelOpened: boolean = false;
  testCaseshowCommentIcon: boolean = false;
  glossaryPanelOpened: boolean = false;
  glossaryshowCommentIcon: boolean = false;
  selectedIndex?: number;
  selectedListItemIndex: number | undefined;

  expandSpecSections: any = [
    'Usecases',
    'Use Cases',
    'User Interface Design',
    'Workflows',
    'Data Dictionary',
    'Annexures',
    'Historical Data Load',
    'Glossary',
    'Version Control',
    'Stakeholder Approvals',
    'OpenAPI Spec',
    'Data Quality Checks',
    'Data Model',
  ];

  constructor(
    private domSanitizer: DomSanitizer,
    private storageService: LocalStorageService,
    private utilsService: UtilsService,
    private specUtils: SpecUtilsService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.utilsService.openDockedNavi.subscribe((res) => {
      this.isDockedNaviOpened = res;
    });
    this.utilsService.openSpecSubMenu.subscribe((res: any) => {
      this.isSideMenuOpened = res;
    });
    this.specUtils.openCommentsPanel.subscribe((event: any) => {
      this.isCommnetsPanelOpened = event;
    });
    this.makeTrustedUrl();
    this.content.forEach((element: any) => {
      if (element.title === 'OpenAPI Spec') {
        // this.fetchOpenAPISpec();
      }
    });
    this.makeBusinessRulesJsonTrue();
  }
  makeBusinessRulesJsonTrue() {
    this.content.forEach((element: any) => {
      if (this.jsonTypes.includes(element.title)) {
        element.showList = true;
      }
    });
  }

  ngOnChanges() {
    if (this.expandView) {
      setTimeout(() => {
        // this.fetchOpenAPISpec()
      }, 500);
    }
  }

  ngAfterViewInit() {
    this.content.forEach((item: any) => {
      if (item.title === 'OpenAPI Spec') {
        this.childLoaded.emit(true);
      }
    });
  }

  openCommentSection() {
    this.utilsService.saveSelectedSection(null);
    localStorage.setItem('selectedSpec', JSON.stringify(this.specItem));
    of([])
      .pipe(delay(500))
      .subscribe((results) => {
        this.specUtils._openCommentsPanel(true);
      });
  }

  checkExpandSpecSections(spec: string) {
    let returnVal: boolean;
    this.expandSpecSections.includes(spec)
      ? (returnVal = true)
      : (returnVal = false);
    return returnVal;
  }

  makeTrustedUrl(): void {
    this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.targetUrl
    );
    localStorage.setItem('targetUrl', this.targetUrl);
  }

  onClickAddComment(obj: any): void {
    this.selectedContent = obj;
    this.showAddCommnetOverlay.emit(obj);
  }
  checkedToggle(type: any, item: any, content: any) {
    this.specItemList.forEach((obj: any) => {
      if (obj.id === item.id) {
        obj.content.forEach((conObj: any) => {
          if (conObj.id === content.id) {
            if (type === 'table') {
              conObj.showTable = true;
              conObj.showJson = false;
              conObj.showList = false;
            } else if (type === 'list') {
              conObj.showTable = false;
              conObj.showJson = false;
              conObj.showList = true;
            } else if (type === 'json') {
              conObj.showTable = false;
              conObj.showJson = true;
              conObj.showList = false;
            }
          }
        });
      }
    });
  }

  checkParaViewSections(title: string) {
    return (
      this.paraViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  checkListViewSections(title: string) {
    return (
      this.listViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  getTestCaseKeys(testCase: any): string[] {
    return Object.keys(testCase);
  }
  isArray(item: any) {
    return Array.isArray(item);
  }

  saveSecInLocal() {
    localStorage.setItem('selectedSpec', JSON.stringify(this.specItem));
  }

  async fetchOpenAPISpec() {
    const record_id = localStorage.getItem('record_id');
    let userData: any;
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    const ui = SwaggerUIBundle({
      domNode: document.getElementById('openapi-ui-spec'),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      url:
        environment.uigenApiUrl +
        'openapi-spec/' +
        localStorage.getItem('app_name') +
        '/' +
        email +
        '/' +
        record_id,
      docExpansion: 'none',
      operationsSorter: 'alpha',
    });
  }
}
