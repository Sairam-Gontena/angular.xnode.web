import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RefreshListService } from '../../RefreshList.service';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { AuthApiService } from 'src/app/api/auth.service';
import { cloneDeep, find, orderBy, sortBy } from 'lodash';
import { DropdownModule } from 'primeng/dropdown';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { MessagingService } from 'src/app/components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { ConversationHubService } from 'src/app/api/conversation-hub.service';

@Component({
  selector: 'xnode-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
  providers: [MessageService, DropdownModule],
})
export class MyProductsComponent implements OnInit {
  templateCard: any[] = [];
  currentUser?: any;
  private subscription: Subscription;
  isLoading: boolean = true;
  activeIndex: number = 0;
  activities: any;
  columnDef: any;
  searchText: any;
  filteredProducts: any[] = [];
  email: any;
  filteredProductsByEmail: any[] = [];
  showLimitReachedPopup: any;
  tabAllProducts = false;
  tabRecent = false;
  tabCreated = false;
  timeAgo: any;
  isTitleHovered: any;
  userImage: any;
  end = 3;
  filteredProductsLength = 0;
  activeIndexRecentActivity: number = 0;
  isViewLess = true;
  AllConversations: any[] = [];
  filteredConversation: any[] = [];
  mineConversations: any[] = [];
  Conversations: any = [
    { name: 'All', value: 'All' },
    { name: 'Mine', value: 'Mine' },
  ];
  selectedConversation: any = { name: 'All', value: 'All' };
  enableSearch: boolean = false;
  searchTextConversation: any;
  loading: boolean = false;
  showImportFilePopup: boolean = false;
  tableFilterEvent: any;
  activity: any;
  selectedActivity: any;
  selectedAllActivity: any;
  allActivity: any;

  constructor(private RefreshListService: RefreshListService,
    public router: Router,
    private route: ActivatedRoute,
    private utils: UtilsService,
    private authApiService: AuthApiService,
    private auditUtil: AuditutilsService,
    private storageService: LocalStorageService,
    private messagingService: MessagingService,
    private conversationService: ConversationHubService) {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    if (this.currentUser.first_name && this.currentUser.last_name) {
      this.userImage =
        this.currentUser.first_name.charAt(0).toUpperCase() +
        this.currentUser.last_name.charAt(0).toUpperCase();
    }
    this.subscription = this.RefreshListService.headerData$.subscribe(
      (data: any) => {
        if (data === 'refreshproducts') {
          this.getMetaData();
        }
      }
    );
    this.utils.startSpinner.subscribe((event: boolean) => {
      this.loading = event;
    });
  }

  ngOnInit(): void {
    this.activity = [
      { name: 'Your Activity', code: 'your' },
      { name: 'Teams Activity', code: 'team' },
    ];
    this.allActivity = [
      { name: 'Conversation', code: 'conversation' },
      { name: 'Thread', code: 'thread' },
      { name: 'Task', code: 'task' },
      { name: 'Comment', code: 'comment' },
      { name: 'Change Request', code: 'change Request' },
      { name: 'Resource', code: 'resource' },
    ]
    this.utils.loadSpinner(true);
    this.messagingService.sendMessage({
      msgType: MessageTypes.PRODUCT_CONTEXT,
      msgData: false,
    });
    this.route.queryParams.subscribe((params: any) => {
      if (params?.entity) {
        this.getConversationById(params?.conversation_id)
      }
      if (params.product === 'created') {
        this.utils.loadToaster({
          severity: 'success',
          summary: 'SUCCESS',
          detail: 'Started generating application, please look out for notifications in the top nav bar',
          life: 10000,
        });
      }
    });
    this.getUsersData()
    this.removeProductDetailsFromStorage();
    this.removeParamFromRoute();
    this.filterProductsByUserEmail();
    this.utils.prepareIframeUrl(true);
    this.getRecentActivities();
    this.getColumnDef();
  }

  getConversationById(id: string): void {
    this.conversationService.getConversations('?id=' + id).then((data: any) => {
      if (data.data)
        this.messagingService.sendMessage({ msgType: MessageTypes.VIEW_IN_CHAT, msgData: { isNaviExpanded: true, toggleConversationPanel: true, showDockedNavi: true, component: 'my-products', componentToShow: 'Chat', conversationDetails: data.data?.data[0] } });
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      console.log(err, 'err')
      this.utils.loadSpinner(false);
    })
  }

  removeProductDetailsFromStorage(): void {
    localStorage.removeItem('record_id');
    localStorage.removeItem('has_insights');
    localStorage.removeItem('app_name');
    localStorage.removeItem('show-upload-panel');
    localStorage.removeItem('product_url');
    localStorage.removeItem('targetUrl');
    localStorage.removeItem('NOTIF_INFO');
    localStorage.removeItem('product_email');
    this.storageService.removeItem(StorageKeys.Product);
    this.storageService.removeItem(StorageKeys.SPEC_DATA);
    this.storageService.removeItem(StorageKeys.SpecVersion);
    this.storageService.removeItem(StorageKeys.SelectedSpec);
    this.storageService.removeItem(StorageKeys.CONVERSATION)
    let getDeepLinkInfoObj: any = this.storageService.getItem(StorageKeys.DEEP_LINK_INFO);
    if (getDeepLinkInfoObj) {
      if (!getDeepLinkInfoObj.naviURL) {
        this.authApiService.setDeeplinkURL("");
        this.storageService.removeItem(StorageKeys.DEEP_LINK_INFO);
      }
    }
    this.getMetaData();
  }

  getMeMyAvatar(userAvatar?: any) {
    if (!userAvatar) {
      return '';
    }
    let parts = userAvatar.split(' ');
    const initials = parts
      .map((part: any) => {
        if (part == 'Created' || part == 'by') {
          return;
        } else if (part == 'you') {
          return (
            this.currentUser?.first_name.charAt(0).toUpperCase() +
            this.currentUser?.last_name.charAt(0).toUpperCase()
          );
        } else {
          return part[0].toUpperCase();
        }
      })
      .join('');
    return initials;
  }

  removeParamFromRoute(): void {
    this.router.navigate([], {
      queryParams: {
        product: null,
      },
      queryParamsHandling: 'merge',
    });
  }
  searchKey(data: string) {
    this.searchText = data;
    this.search("");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickProductChat(product: any): void {
    this.utils.loadSpinner(true);
    this.conversationService.getConversations('?productId=' + product.id).then((data: any) => {
      if (data.data)
        this.messagingService.sendMessage({ msgType: MessageTypes.VIEW_IN_CHAT, msgData: { isNaviExpanded: false, showDockedNavi: true, component: 'my-products', componentToShow: 'Chat', conversationDetails: data.data?.data[0] } });
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      console.log(err, 'err')
      this.utils.loadSpinner(false);
    })
  }

  onClickProductCard(data: any): void {
    this.utils.loadSpinner(true);
    this.auditUtil.postAudit('ON_CLICK_PRODUCT', 1, 'SUCCESS', 'user-audit');
    if (this.currentUser?.email == data.email) {
      this.utils.hasProductPermission(true);
    } else {
      this.utils.hasProductPermission(false);
    }
    this.getConversationByProduct(data);
  }

  recentActivityEvent(record: any): void {
    record.id = record.record;
    switch (record.objectType) {
      case 'Conversation':
        this.getConversationById(record.objectId);
        break;
      case "Product_Spec":
        this.onClickProductCard(record);
        break;
      case "Thread":
        this.getThreadDetails(record);
        break;
      case "Resource":
        this.getResourceDetails(record);
        break;
      case "Task":
        this.getTaskDetails(record);
        break;
      case "Comment":
        this.getCommentDetailsDetails(record);
        break;
      default:
        break;
    }
  }
  getTaskDetails(record: any): void {
    this.messagingService.sendMessage({
      msgType: MessageTypes.TASK_DETAILS,
      msgData: {
        taskDetails: record.actionDetail
      },
    });
  }

  getCommentDetailsDetails(record: any): void {
    this.messagingService.sendMessage({
      msgType: MessageTypes.COMMENT_DETAILS,
      msgData: {
        commentDetails: record.actionDetail
      },
    });
  }

  getThreadDetails(record: any): void {
    this.messagingService.sendMessage({
      msgType: MessageTypes.THREAD_DETAILS,
      msgData: {
        threadDetails: record.actionDetail
      },
    });
  }

  getResourceDetails(record: any): void {
    this.messagingService.sendMessage({
      msgType: MessageTypes.RESOURCE_DETAILS,
      msgData: {
        threadDetails: record.actionDetail
      },
    });
  }

  getConversationByProduct(product: any): void {
    this.conversationService.getConversations('?productId=' + product.id).then((data: any) => {
      if (data.data) {
        this.messagingService.sendMessage({ msgType: MessageTypes.PRODUCT_SELECTED, msgData: { product: product, conversationDetails: data.data.data[0] } });
        localStorage.setItem('record_id', data.id);
        localStorage.setItem('app_name', data.title);
        localStorage.setItem('has_insights', data.has_insights);
        this.router.navigate(['/specification']);
      }
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      console.log(err, 'err')
      this.utils.loadSpinner(false);
    })
  }


  onClickNew() {
    this.utils.expandNavi$();
  }

  openExternalLink(productUrl: string) {
    productUrl += '&openExternal=true';
    window.open(productUrl, '_blank');
  }

  importResource(): void {
    this.messagingService.sendMessage({
      msgType: MessageTypes.IMPORT_RESOURCE,
      msgData: {
        import_event: true
      },
    });
  }

  closeEventEmitter() {
    this.showImportFilePopup = false;
  }

  getRecentActivities() {
    const userId = this.currentUser.user_id;
    if (userId) {
      this.conversationService.getRecentActivities(userId).subscribe((res: any) => {
        let activities: any = [];
        for (let activity of res.data.data) {
          let row: any = {
            id: activity.id,
            objectId: activity.objectId,
            objectType: activity.objectType,
            userAction: activity.userAction,
            modifiedBy: [activity.modifiedBy],
            modifiedOn: (new Date(activity.modifiedOn).toLocaleString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: 'numeric', minute: 'numeric', second: 'numeric',
              hour12: true,
            })),
            users: [activity.modifiedBy],
            description: activity.description,
            title: activity.actionDetail.title || "",
            shortId: activity.objectShortId || "",
            summarize: activity.actionDetail.isSummarizationQueue,
            status: activity.actionDetail.status,
            actionDetail: activity.actionDetail
          }
          activities.push(row)
        }
        this.activities = activities; // Handle the response here
      });
    }
  }
  onChangeSelectedActivity(event: any) {
    console.log(event.value.name, "Selected Activity");
  }
  onChangeSelectedAll(event: any) {
    console.log(event.value.name, "Selected All");
  }
  getColumnDef() {
    this.columnDef = [

      {
        field: "title",
        header: "Title",
        width: 350,
        filter: true,
        sortable: true,
        visible: true,
        default: true
      },
      {
        field: "shortId",
        header: "Id",
        width: 100,
        filter: true,
        sortable: true,
        visible: true,
        default: true
      },
      // {
      //   field: "userAction",
      //   header: "Action",
      //   width: 100,
      //   visible: true,
      //   default: true
      // },
      // {
      //   field: "description",
      //   header: "Description",
      //   filter: true,
      //   sortable: true,
      //   visible: true,
      //   default: true
      // },
      {
        field: "modifiedBy",
        header: "Modified By",
        // filter: true,
        sortable: true,
        type: 'avatar',
        width: 120,
        visible: true,
        default: true
      },
      {
        field: "status",
        header: "Status",
        width: 300,
        filter: true,
        sortable: true,
        visible: true,
        default: true
      },
      {
        field: "summarize",
        header: "Summarize",
        width: 300,
        filter: true,
        sortable: true,
        visible: true,
        default: true
      },
      {
        field: "objectType",
        header: "Entity",
        width: 100,
        filter: true,
        sortable: true,
        visible: true,
        default: true
      },
      {
        field: "modifiedOn",
        header: "Modified On",
        width: 300,
        // type: "d/m/y",
        filter: true,
        sortable: true,
        visible: true,
        default: true
      },

    ]
  }
  getUsersData() {
    this.utils.loadSpinner(true);
    this.authApiService
      .getAllUsers(this.currentUser?.account_id)
      .then((resp: any) => {
        if (resp?.status === 200) {
          this.storageService.saveItem(StorageKeys.USERLIST, resp.data);
          this.messagingService.sendMessage({ msgType: MessageTypes.USER_LIST, msgData: resp.data })
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: '',
            detail: resp.data?.detail,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((error: any) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: '',
          detail: error,
        });
        console.error(error);
      });
  }

  getMetaData() {
    this.conversationService.getProductsByUser({ accountId: this.currentUser.account_id, userId: this.currentUser?.user_id, userRole: 'all' }).then((response: any) => {
      this.utils.loadSpinner(false);
      if (response?.status === 200 && response.data) {
        let user_audit_body = {
          method: 'GET',
          url: response?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_METADATA_MY_PRODUCTS',
          1,
          'SUCCESS',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          ''
        );
        this.storageService.saveItem(StorageKeys.MetaData, response.data);
        this.templateCard = response.data.map((dataItem: any) => {
          dataItem.timeAgo = this.utils.calculateTimeAgo(dataItem.created_on);
          if (this.currentUser.user_id === dataItem?.user_id)
            dataItem.created_by = 'Created by you';
          else dataItem.created_by = 'Created by ' + dataItem?.username;
          return dataItem;
        });
        this.filteredProducts = sortBy(this.templateCard, ['created_on']).reverse();
        this.filteredProductsLength = this.filteredProducts.length
          ? this.filteredProducts.length + 1 : 0;
        this.filteredProductsByEmail = this.templateCard;
        this.activeIndex = 1;
        this.onClickcreatedByYou();
        if (this.authApiService.getDeeplinkURL()) {
          this.utils.setDeepLinkInfo(this.authApiService.getDeeplinkURL());
        }
        this.utils.loadSpinner(false);
      }
      else {
        let user_audit_body = {
          method: 'GET',
          url: response?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_METADATA_MY_PRODUCTS',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          ''
        );
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: response?.data?.detail,
        });
        this.utils.loadSpinner(false);
      }


    }).catch((error: any) => {
      this.utils.loadSpinner(false);
    });
  }

  onClickcreatedByYou(): void {
    this.filteredProducts = sortBy(
      this.templateCard.filter((obj) => {
        return obj?.createdBy?.userId === this.currentUser.user_id;
      })
    )
    this.filteredProductsLength = this.filteredProducts.length
      ? this.filteredProducts.length + 1
      : 0;
    this.end = 3;
    this.isViewLess = true;

  }

  onClickAllProducts(): void {
    this.filteredProducts = sortBy(
      [...this.templateCard],
      ['created_on']
    ).reverse();
    this.filteredProductsLength = this.filteredProducts.length
      ? this.filteredProducts.length + 1
      : 0;
    this.filteredProducts = cloneDeep(this.filteredProducts);
    this.end = 3;
    this.isViewLess = true;
  }

  search(event: any) {
    this.filteredProducts = this.searchText === '' ? this.templateCard :
      this.templateCard.filter((element) => {
        return element.title?.toLowerCase().includes(this.searchText.toLowerCase());
      });
    if (event) {
      this.tableFilterEvent = event;
    }
  }

  clearSearch(event: any) {
    this.searchText = "";
    this.search(event);
  }

  searchConversation() {
    this.filteredConversation = this.searchTextConversation === '' ? this.AllConversations :
      this.AllConversations.filter((element) => {
        return element.title?.toLowerCase().includes(this.searchTextConversation.toLowerCase());
      });
  }

  toggleSearch() {
    this.enableSearch = this.enableSearch ? false : true;
  }

  filterProductsByUserEmail() {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.filteredProductsByEmail = this.templateCard.filter(
      (product) => product.email === this.currentUser.email
    );
    this.getMeCreateAppLimit();
  }

  onClickNewWithNavi(): void {
    this.messagingService.sendMessage({
      msgType: MessageTypes.NEW_WITH_NAVI,
      msgData: 'new-with-navi',
    });
  }

  getMeCreateAppLimit(): void {
    this.authApiService.get('/user/get_create_app_limit/' + this.currentUser.email).then(
      (response: any) => {
        if (response?.status === 200) {
          localStorage.setItem('restriction_max_value', response.data[0].restriction_max_value);
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_METADATA_MY_PRODUCTS',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            ''
          );
        } else {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_METADATA_MY_PRODUCTS',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            '');
          this.utils.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail });
        }
      })
      .catch((error: any) => {
        let user_audit_body = {
          method: 'GET',
          url: error?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_METADATA_MY_PRODUCTS',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          ''
        );
        this.utils.loadToaster({ severity: 'error', summary: '', detail: error });
      });
  }

  onViewAll() {
    this.isViewLess = false;
    this.end = this.filteredProductsLength;
  }

  onViewLess() {
    this.isViewLess = true;
    this.end = 3;
  }

  mapProductNameToConversations(_conversations: any) {
    _conversations.forEach((conversation: any, i: any) => {
      let product = find(this.filteredProducts, { id: conversation.productId });
      _conversations[i]['productName'] =
        product && product.title ? product.title : '';
    });
    return orderBy(_conversations, ['modifiedOn']);
  }
}
