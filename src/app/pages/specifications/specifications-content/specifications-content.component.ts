import { Component, Input, ViewChild, ElementRef, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UtilsService } from 'src/app/components/services/utils.service';
import { environment } from 'src/environments/environment';
import * as _ from "lodash";
import { DataService } from '../../er-modeller/service/data.service';
import { ApiService } from 'src/app/api/api.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { SECTION_VIEW_CONFIG } from '../section-view-config';
declare const SwaggerUIBundle: any;
@Component({
  selector: 'xnode-specifications-content',
  templateUrl: './specifications-content.component.html',
  styleUrls: ['./specifications-content.component.scss']
})

export class SpecificationsContentComponent implements OnInit {
  @Input() specData: any;
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  paraViewSections = SECTION_VIEW_CONFIG.paraViewSections;
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;
  app_name: any;
  iframeSrc: SafeResourceUrl = '';
  dataModelIframeSrc: SafeResourceUrl = '';
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

  constructor(private utils: UtilsService,
    private domSanitizer: DomSanitizer,
    private dataService: DataService,
    private apiService: ApiService) {
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
      this.isCommentPanelOpened = pnl === SidePanel.Comments;
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

  onClickSeeMore(item: any, content: any): void {
    this.selectedContent = content;
    this.showMoreContent = !this.showMoreContent;
    this.specItemList.forEach((obj: any) => {
      if (obj.id === item.id) {
        obj.content.forEach((conObj: any) => {
          if (conObj.id === content.id)
            conObj.collapsed = true;
        })
      }
    })
  }

  onClickSeeLess(item: any, content: any): void {
    this.selectedContent = content;
    this.showMoreContent = false;
    this.specItemList.forEach((obj: any) => {
      if (obj.id === item.id) {
        obj.content.forEach((conObj: any) => {
          if (conObj.id === content.id)
            conObj.collapsed = false;
        })
      }
    })
    setTimeout(() => {
      this.utils.saveSelectedSection(item);
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

  onClickComment(item: any) {
    this.utils.saveSelectedSection(item);
    this.utils.openOrClosePanel(SidePanel.Comments);
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

  sendComment(content: any) {
    let user_id = localStorage.getItem('product_email') || (localStorage.getItem('product') && JSON.parse(localStorage.getItem('product') || '{}').email)
    if (this.smallCommentContent && this.smallCommentContent.length) {
      let body: any = {
        product_id: localStorage.getItem('record_id'),
        content_id: content.id,
        comments: [{
          user_id: user_id,
          message: this.smallCommentContent
        }]
      };
      this.apiService.patchApi(body, 'specs/update-comments')
        .then((response: any) => {
          this.isOpenSmallCommentBox = false;
        })
        .catch((error: any) => {
          this.isOpenSmallCommentBox = false;
        });
    }
  }

  checkParaViewSections(title: string) {
    return this.paraViewSections.filter(secTitle => { return secTitle === title }).length > 0;
  }
  checkListViewSections(title: string) {
    return this.listViewSections.filter(secTitle => { return secTitle === title }).length > 0;
  }
}


