import {
  Component,
  Input,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from 'src/app/components/services/utils.service';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { DataService } from '../../er-modeller/service/data.service';
import { SECTION_VIEW_CONFIG } from '../section-view-config';
import { CommentsService } from 'src/app/api/comments.service';
import { ApiService } from 'src/app/api/api.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { ActivatedRoute } from '@angular/router';
import { AuthApiService } from 'src/app/api/auth.service';
import { delay, of } from 'rxjs';
declare const SwaggerUIBundle: any;

@Component({
  selector: 'xnode-specifications-content',
  templateUrl: './specifications-content.component.html',
  styleUrls: ['./specifications-content.component.scss'],
})
export class SpecificationsContentComponent implements OnInit {
  @Input() specData?: any;
  @Input() keyword: any;
  @Input() noResults: any;
  @Input() reveiwerList: any;
  // @Input() useCases: any[] = [];
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  @Output() openAndGetComments = new EventEmitter<any>();
  @Output() getCommentsAfterUpdate = new EventEmitter<any>();
  app_name: any;
  searchTerm: any;
  showMoreContent?: boolean = false;
  selectedSpecItem: any;
  specItemList: any = [];
  selectedSpecItemListTitles: any = [];
  selectedContent: any;
  targetUrl: string = environment.naviAppUrl;
  dataModel: any;
  dataToExpand: any;
  specExpanded: boolean = false;
  checked: boolean = false;
  bodyData: any[] = [];
  dataQualityData: any[] = [];
  userInterfaceheaders: string[] = [];
  isOpenSmallCommentBox: boolean = false;
  smallCommentContent: string = '';
  product: any;
  isContentSelected = false;
  isCommnetsPanelOpened: boolean = false;
  list: any;
  currentUser: any;
  usersList: any = null;
  isSpecSideMenuOpened: boolean = false;
  isDockedNaviOpended: boolean = false;
  expandView: any = null;
  swaggerData: any;

  constructor(
    private utils: UtilsService,
    private dataService: DataService,
    private apiservice: ApiService,
    private storageService: LocalStorageService,
    private specUtils: SpecUtilsService,
    private route: ActivatedRoute,
    private authApiService: AuthApiService
  ) {
    this.dataModel = this.dataService.data;
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    // this.getUsersData();
    this.utils.getMeSpecItem.subscribe((event: any) => {
      if (event) {
        this.specItemList = event;
      }
    });
    this.utils.getMeSelectedSection.subscribe((event: any) => {
      if (event) {
        this.selectedSpecItem = event;
        this.onSelectMenuItem();
      }
    });
    this.specUtils.openCommentsPanel.subscribe((event: any) => {
      this.isCommnetsPanelOpened = event;
    });
    this.utils.openSpecSubMenu.subscribe((event: any) => {
      this.isSpecSideMenuOpened = event;
    });
    this.utils.openDockedNavi.subscribe((event: any) => {
      this.isDockedNaviOpended = event;
    });
  }

  onChildLoaded(isLoaded: boolean) {
    if (isLoaded) {
      of([])
        .pipe(delay(500))
        .subscribe((results) => {
          // this.fetchOpenAPISpec();
        });
    }
  }

  ngOnInit(): void {
    this.utils.openDockedNavi.subscribe((data: any) => {
      if (data) {
        this.isCommnetsPanelOpened = false;
      }
    });
    this.targetUrl =
      environment.designStudioAppUrl +
      '?email=' +
      this.product?.email +
      '&id=' +
      this.product?.id +
      '&targetUrl=' +
      environment.xnodeAppUrl +
      '&has_insights=' +
      true +
      '&isVerified=true' +
      '&userId=' +
      this.currentUser.id;
    // this.fetchOpenAPISpec();
    // this.getUserByAccountId();
    // this.fetchOpenAPISpec();
  }

  getDeepLinkInfo(key: string) {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(key);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  ngOnDestroy() {
    // this.specUtils._openCommentsPanel(false);
    this.utils.EnableSpecSubMenu();
  }
  ngOnChanges() {
    this.specItemList = this.specData;
    this.searchTerm = this.keyword;
    this.product = this.storageService.getItem(StorageKeys.Product);
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

  getUsersData() {
    this.apiservice
      .getAuthApi(
        'user/get_all_users?account_id=' + this.currentUser?.account_id
      )
      .then((resp: any) => {
        this.utils.loadSpinner(true);
        if (resp?.status === 200) {
          this.usersList = resp.data;
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: '',
            detail: resp.data?.detail,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((error) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: '',
          detail: error,
        });
        console.error(error);
      });
  }

  _onClickSeeMore(event: any): void {
    this.selectedContent = event.content;
    this.showMoreContent = !this.showMoreContent;
    this.specItemList.forEach((obj: any) => {
      if (obj.id === event.item.id) {
        obj.content.forEach((conObj: any) => {
          if (conObj.id === event.content.id) conObj.collapsed = true;
        });
      }
    });
  }

  _onClickSeeLess(event: any): void {
    this.selectedContent = event.content;
    this.showMoreContent = false;
    this.specItemList.forEach((obj: any) => {
      if (obj.id === event.item.id) {
        obj.content.forEach((conObj: any) => {
          if (conObj.id === event.content.id) conObj.collapsed = false;
        });
      }
    });
    setTimeout(() => {
      this.scrollToItemOnSeeLess(event?.content?.id);
      this.utils.saveSelectedSection(event.item);
    }, 100);
  }

  async scrollToItem() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const element = document.getElementById(this.selectedSpecItem.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  async scrollToItemOnSeeLess(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getMeBanner(event: any) {
    return (
      './assets/' + event?.title?.toLowerCase()?.replace(/ /g, '') + '.svg'
    );
  }

  toTitleCase(str: any): void {
    let words = str.split(' ');
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return words.join(' ');
  }

  async fetchOpenAPISpec() {
    const record_id = localStorage.getItem('record_id');
    let userData: any;
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let swaggerUrl =
      environment.uigenApiUrl +
      'openapi-spec/' +
      localStorage.getItem('app_name') +
      '/' +
      email +
      '/' +
      record_id;
    const ui = SwaggerUIBundle({
      domNode: document.getElementById('openapi-ui-spec'),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      url: swaggerUrl,
      docExpansion: 'none',
      operationsSorter: 'alpha',
    });
    fetch(swaggerUrl)
      .then((response) => response.json())
      .then((data) => (this.swaggerData = data))
      .catch((error) => console.error('Error:', error));
  }

  _expandComponent(val: any): void {
    if (val) {
      this.selectedSpecItem = val;
      this.utils.saveSelectedSection(val);
      this.specUtils._openCommentsPanel(false);
      this.utils.disableDockedNavi();
      this.utils.EnableSpecSubMenu();
      this.specExpanded = true;
    } else {
      this.specExpanded = false;
    }
  }

  onSelectMenuItem(): void {
    this.scrollToItem();
  }
  closeFullScreenView(): void {
    this.expandView = true;
    this.specExpanded = false;
    // this.fetchOpenAPISpec();
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
  getUserByAccountId(): void {
    this.authApiService
      .getAllUsers(
        'user/get_all_users?account_id=' + this.currentUser?.account_id
      )
      .then((response: any) => {
        if (response.status === 200 && response?.data) {
          response.data.forEach((element: any) => {
            element.name = element.first_name + ' ' + element.last_name;
          });
          this.reveiwerList = response.data;
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response.data.detail,
          });
          this.utils.loadSpinner(false);
        }
      })
      .catch((err: any) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }
}
