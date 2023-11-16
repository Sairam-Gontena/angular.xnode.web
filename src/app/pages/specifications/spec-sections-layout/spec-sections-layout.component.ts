import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SECTION_VIEW_CONFIG } from '../section-view-config';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-spec-sections-layout',
  templateUrl: './spec-sections-layout.component.html',
  styleUrls: ['./spec-sections-layout.component.scss']
})

export class SpecSectionsLayoutComponent implements OnInit {
  @Input() content: any;
  @Input() searchTerm: any;
  @Input() sectionIndex!: number;
  @Input() specItem: any;
  @Input() readOnly!: boolean;
  @Input() targetUrl: string = '';
  @Input() isOpenSmallCommentBox!: boolean;
  @Input() commentList: any;
  @Input() usersList: any = [];
  @Input() useCases: any[] = [];
  @Input() selectedSpecItem: any;
  @Input() specItemList: any;
  @Output() getCommentsAfterUpdate = new EventEmitter<any>();
  @Output() onClickSeeMore = new EventEmitter<any>();
  @Output() onClickSeeLess = new EventEmitter<any>();
  @Output() showAddCommnetOverlay = new EventEmitter<any>();
  @Output() expandComponent = new EventEmitter<any>();
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
  businessRulesPanelOpened: boolean = false;
  businessRulesshowCommentIcon: boolean= false;
  dataDictionaryshowCommentIcon: boolean= false;
  dataDictionaryPanelOpened: boolean= false;
  functionalDependenciesshowCommentIcon: boolean= false;
  functionalDepedencyPanelOpened: boolean= false;
  userInterfacePanelOpened: boolean= false;
  userInterfaceshowCommentIcon: boolean= false;
  AnnexuresPanelOpened:boolean= false;
  AnnexureshowCommentIcon:boolean= false;
  constructor(private domSanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
    }
    this.makeTrustedUrl();

  }

  makeTrustedUrl(): void {
    this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }

  onClickAddComment(obj: any): void {
    this.selectedContent = obj.content;
    this.showAddCommnetOverlay.emit(obj)
  }

  checkedToggle(type: any, item: any, content: any) {
    this.specItemList.forEach((obj: any) => {
      if (obj.id === item.id) {
        obj.content.forEach((conObj: any) => {
          if (conObj.id === content.id && type === 'table')
            conObj.showTable = true;
          else
            conObj.showTable = false;
        })
      }
    })
  }

  checkParaViewSections(title: string) {
    return this.paraViewSections.filter(secTitle => { return secTitle === title }).length > 0;
  }

  checkListViewSections(title: string) {
    return this.listViewSections.filter(secTitle => { return secTitle === title }).length > 0;
  }

  getTestCaseKeys(testCase: any): string[] {
    return Object.keys(testCase);
  }
  isArray(item: any) {
    return Array.isArray(item);
  }

}
