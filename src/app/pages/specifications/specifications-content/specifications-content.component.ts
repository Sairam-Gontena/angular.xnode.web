import { Component, Input, ViewChild, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UtilsService } from 'src/app/components/services/utils.service';
import { environment } from 'src/environments/environment';
import * as _ from "lodash";
import { DataService } from '../../er-modeller/service/data.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { SECTION_VIEW_CONFIG } from '../section-view-config';
import { CommentsService } from 'src/app/api/comments.service';
import { ApiService } from 'src/app/api/api.service';
declare const SwaggerUIBundle: any;

@Component({
  selector: 'xnode-specifications-content',
  templateUrl: './specifications-content.component.html',
  styleUrls: ['./specifications-content.component.scss']
})

export class SpecificationsContentComponent implements OnInit {
  @Input() specData: any;
  @Input() keyword: any;
  @Input() noResults: any;
  @Input() useCases: any[] = [];
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  @Output() openAndGetComments = new EventEmitter<any>();
  @Output() getCommentsAfterUpdate = new EventEmitter<any>();
  paraViewSections = SECTION_VIEW_CONFIG.paraViewSections;
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;
  app_name: any;
  iframeSrc: SafeResourceUrl = '';
  dataModelIframeSrc: SafeResourceUrl = '';
  searchTerm: any;
  showMoreContent?: boolean = false;
  selectedSpecItem: any;
  specItemList: any = [];
  selectedSpecItemListTitles: any = [];
  selectedContent: any;
  targetUrl: string = environment.naviAppUrl;
  dataModel: any;
  dataToExpand: any
  specExpanded: boolean = false;
  checked: boolean = false;
  bodyData: any[] = [];
  dataQualityData: any[] = [];
  userInterfaceheaders: string[] = [];
  isCommentPanelOpened: boolean = false;
  isOpenSmallCommentBox: boolean = false;
  smallCommentContent: string = '';
  product: any;
  isContentSelected = false;
  isCommnetsPanelOpened: boolean = false;
  commentList: any;
  tasksList: any;
  currentUser: any;
  usersList: any;

  constructor(private utils: UtilsService,
    private domSanitizer: DomSanitizer,
    private dataService: DataService,
    private apiservice: ApiService,
    private commentsService: CommentsService) {
    this.dataModel = this.dataService.data;
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    this.utils.getMeSpecItem.subscribe((event: any) => {
      if (event) {
        this.specItemList = event;
      }
    })
    this.utils.getMeSelectedSection.subscribe((event: any) => {
      if (event) {
        this.selectedSpecItem = event;
        this.closeFullScreenView();
      }
    })

    this.utils.sidePanelChanged.subscribe((pnl: SidePanel) => {
      this.isCommnetsPanelOpened = pnl === SidePanel.Comments;
    });
    this.utils.getMeLatestComments.subscribe((event: any) => {
      if (event === 'comment' || event == 'reply') {
        this.getMeCommentsList();
      } else if (event === 'task') {
        this.getMeTasksList()
      }
    })
  }


  ngOnInit(): void {
    this.utils.openDockedNavi.subscribe((data: any) => {
      if (data) {
        this.isCommnetsPanelOpened = false;
      }
    })
    const record_id = localStorage.getItem('record_id');
    const product = localStorage.getItem('product');
    this.app_name = localStorage.getItem('app_name');
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let user_id = JSON.parse(userData).id;
    if (product) {
      this.product = JSON.parse(product)
    }
    if (record_id) {
      this.targetUrl = environment.designStudioAppUrl + "?email=" + this.product?.email + "&id=" + record_id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + true + '&isVerified=true' + "&userId=" + user_id;
    }
    this.utils.sidePanelChanged.subscribe((res) => {
      if (res) {
        this.getMeCommentsList();
        this.getMeTasksList()
      }
    })
    this.makeTrustedUrl();
    this.getUsersData();
  }

  ngAfterViewInit() {
    this.fetchOpenAPISpec()
  }

  ngOnChanges() {
    this.specItemList = this.specData;
    this.searchTerm = this.keyword;
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

  getUsersData() {
    this.apiservice.getAuthApi('user/get_all_users?account_id=' + this.currentUser?.account_id).then((resp: any) => {
      this.utils.loadSpinner(true);
      if (resp?.status === 200) {
        this.usersList = resp.data;

      } else {
        this.utils.loadToaster({ severity: 'error', summary: '', detail: resp.data?.detail });
      }
      this.utils.loadSpinner(false);
    }).catch((error) => {
      this.utils.loadToaster({ severity: 'error', summary: '', detail: error });
      console.error(error);
    })
  }

  isObject(value: any): boolean {
    return typeof value === 'object';
  }

  returnValues(obj: any) {
    return Object.values(obj)
  }

  getMeCommentsList() {
    this.utils.loadSpinner(true);
    let specData = localStorage.getItem('selectedSpec');
    let selectedSpec: any;
    if (specData) {
      selectedSpec = JSON.parse(specData);
      this.commentsService.getComments({ parentId: selectedSpec.id, isReplyCountRequired: true }).then((response: any) => {
        if (response && response.data) {
          this.utils.saveCommentList(response.data)
          this.commentList = response.data;
        }
        this.utils.loadSpinner(false);
      }).catch(err => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
    }
  }
  getMeTasksList() {
    this.utils.loadSpinner(true);
    let specData = localStorage.getItem('selectedSpec');
    let selectedSpec: any;
    if (specData) {
      selectedSpec = JSON.parse(specData);
      this.commentsService.getTasks({ parentId: selectedSpec.id }).then((response: any) => {
        if (response && response.data) {
          // this.utils.saveCommentList(response.data)
          this.tasksList = response.data;
        }
        this.utils.loadSpinner(false);
      }).catch(err => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
    }
  }

  isArray(item: any) {
    return Array.isArray(item);
  }

  _onClickSeeMore(event: any): void {
    this.selectedContent = event.content;
    this.showMoreContent = !this.showMoreContent;
    this.specItemList.forEach((obj: any) => {
      if (obj.id === event.item.id) {
        obj.content.forEach((conObj: any) => {
          if (conObj.id === event.content.id)
            conObj.collapsed = true;
        })
      }
    })
  }

  _onClickSeeLess(event: any): void {
    this.selectedContent = event.content;
    this.showMoreContent = false;
    this.specItemList.forEach((obj: any) => {
      if (obj.id === event.item.id) {
        obj.content.forEach((conObj: any) => {
          if (conObj.id === event.content.id)
            conObj.collapsed = false;
        })
      }
    })
    setTimeout(() => {
      this.utils.saveSelectedSection(event.item);
    }, 100)
  }

  async scrollToItem() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const element = document.getElementById(this.selectedSpecItem.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getMeBanner(event: any) {
    return './assets/' + event?.title?.toLowerCase()?.replace(/ /g, '') + '.svg';
  }

  makeTrustedUrl(): void {
    this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }

  makeTrustDataModelUrl(): void {
    this.dataModelIframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://dev-xnode.azurewebsites.net/#/configuration/data-model/overview')
  }

  toTitleCase(str: any): void {
    let words = str.split(' ');
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return words.join(' ');
  }

  setColumnsToTheTable(data: any) {
    let cols;
    cols = Object.entries(data).map(([field, value]) => ({ field, header: this.toTitleCase(field), value }));
    return cols
  }

  async fetchOpenAPISpec() {
    const record_id = localStorage.getItem('record_id');
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    const ui = SwaggerUIBundle({
      domNode: document.getElementById('openapi-ui-spec'),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      url: environment.uigenApiUrl + 'openapi-spec/' + localStorage.getItem('app_name') + "/" + email + '/' + record_id,
      docExpansion: 'none',
      operationsSorter: 'alpha'
    });
  }

  _expandComponent(val: any): void {
    if (val) {
      this.selectedSpecItem = val;
      this.utils.saveSelectedSection(val);
      this.specExpanded = true;
    } else {
      this.specExpanded = false;
    }
  }

  closeFullScreenView(): void {
    this.specExpanded = false;
    this.fetchOpenAPISpec();
    this.scrollToItem();
  }

  _showAddCommnetOverlay(event: any) {
    this.specItemList.forEach((element: any) => {
      if (event.item.id === element.id)
        element.content.forEach((subEle: any) => {
          if (event.content.id === subEle.id) {
            subEle.showCommentOverlay = true;
            this.isOpenSmallCommentBox = true;
          } else {
            subEle.showCommentOverlay = false;
          }
        });
    });
  }

  getTestCaseKeys(testCase: any): string[] {
    return Object.keys(testCase);
  }

  openSmallCommentBox(content: any) {
    if (content && content.id) {
      this.isOpenSmallCommentBox = true;
    }
  }

  closeSmallCommentBix() {
    this.isOpenSmallCommentBox = false;
  }

  checkSelection(item: any, obj: any) {
    this.selectedSpecItem = obj;
    const selection = window.getSelection();
    if (selection?.toString() !== '') {
      const selectedElement = selection?.anchorNode?.parentElement;
      const selectedContent = selection?.toString();
      this.specItemList.forEach((element: any) => {
        if (item.id === element.id)
          element.content.forEach((subEle: any) => {
            if (obj.id === subEle.id) {
              subEle.showCommentOverlay = true;
              this.isOpenSmallCommentBox = true;
            } else {
              subEle.showCommentOverlay = false;
            }
          });
      });
    } else {
      console.log('Content is not selected.');
    }
  }

  checkParaViewSections(title: string) {
    return this.paraViewSections.filter(secTitle => { return secTitle === title }).length > 0;
  }
  checkListViewSections(title: string) {
    return this.listViewSections.filter(secTitle => { return secTitle === title }).length > 0;
  }
}


