import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SECTION_VIEW_CONFIG } from '../section-view-config';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-spec-sections-layout',
  templateUrl: './spec-sections-layout.component.html',
  styleUrls: ['./spec-sections-layout.component.scss'],
})
export class SpecSectionsLayoutComponent implements OnInit,AfterViewInit  {
  @Input() content: any;
  @Input() searchTerm: any;
  @Input() sectionIndex!: number;
  @Input() specItem: any;
  @Input() readOnly!: boolean;
  @Input() targetUrl: string = '';
  @Input() isOpenSmallCommentBox!: boolean;
  @Input() usersList: any = [];
  // @Input() useCases: any[] = [];
  @Input() selectedSpecItem: any;
  @Input() specItemList: any;
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
  specExpanded: any;
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
  }

  ngAfterViewInit() {
    this.content.forEach((item:any)=>{
      if(item.title === 'OpenAPI Spec'){
        this.childLoaded.emit(true);
      }
    });
  }

  openCommentSection(){
    this.specUtils._openCommentsPanel(false);
    this.utilsService.saveSelectedSection(null);
    localStorage.setItem('selectedSpec', JSON.stringify(this.specItem));
    setTimeout(() => {
      this.specUtils._openCommentsPanel(true);
    },);
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
    localStorage.setItem('targetUrl',this.targetUrl)
  }

  onClickAddComment(obj: any): void {
    this.selectedContent = obj.content;
    this.showAddCommnetOverlay.emit(obj);
  }

  checkedToggle(type: any, item: any, content: any) {
    this.specItemList.forEach((obj: any) => {
      if (obj.id === item.id) {
        obj.content.forEach((conObj: any) => {
          if (conObj.id === content.id && type === 'table')
            conObj.showTable = true;
          else conObj.showTable = false;
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
}
