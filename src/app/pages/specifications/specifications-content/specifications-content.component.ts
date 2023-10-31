import { Component, Input, ViewChild, OnInit, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UtilsService } from 'src/app/components/services/utils.service';
import { environment } from 'src/environments/environment';
import * as _ from "lodash";
import { DataService } from '../../er-modeller/service/data.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { SECTION_VIEW_CONFIG } from '../section-view-config';
import { CommentsService } from 'src/app/api/comments.service';
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


  constructor(private utils: UtilsService,
    private domSanitizer: DomSanitizer,
    private dataService: DataService,
    private renderer: Renderer2,
    private el: ElementRef,
    private commentsService: CommentsService) {
    this.dataModel = this.dataService.data;
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

  isObject(value: any): boolean {
    return typeof value === 'object';
  }

  returnValues(obj: any) {
    return Object.values(obj)
  }

  ngAfterViewInit() {
    this.fetchOpenAPISpec()
  }

  ngOnChanges() {
    this.specItemList = this.specData;
    this.searchTerm = this.keyword;
  }

  ngOnInit(): void {
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

    this.makeTrustedUrl();
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

  scrollToItem() {
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

  expandComponent(val: any): void {
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
    setTimeout(() => {
      this.scrollToItem();
      this.fetchOpenAPISpec();
    }, 1000);
  }

  _onClickComment(event: any) {
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

  sendComment(comment: any) {
    this.utils.openOrClosePanel(SidePanel.Comments);
    let user_id = localStorage.getItem('product_email') || (localStorage.getItem('product') && JSON.parse(localStorage.getItem('product') || '{}').email)
    this.isOpenSmallCommentBox = false;
    this.commentsService.getComments(this.selectedSpecItem)
      .then((commentsReponse: any) => {
        let body: any = {
          product_id: localStorage.getItem('record_id'),
          content_id: this.selectedSpecItem.id,
        };
        if (commentsReponse && commentsReponse.data && commentsReponse.data.comments) {
          this.isOpenSmallCommentBox = false;
          body.comments = [
            ...commentsReponse['data']['comments'],
            ...[{
              user_id: user_id,
              message: comment,
            }]
          ]
        } else {
          body.comments = [{
            user_id: user_id,
            message: comment
          }]
        }
        this.commentsService.updateComments(body)
          .then((response: any) => {
            this.smallCommentContent = "";
            this.getCommentsAfterUpdate.emit(comment);
            this.utils.openOrClosePanel(SidePanel.Comments);
          })
          .catch((error: any) => {
            this.smallCommentContent = "";
          });
      })
      .catch(res => {
        console.log("comments get failed");
      })
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


