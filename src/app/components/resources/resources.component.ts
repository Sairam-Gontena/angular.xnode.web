import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { ResourcesTableColumn } from './Resources-columns-definitions';
import _ from 'lodash';
import { LocalStorageService } from '../services/local-storage.service';
import { UtilsService } from '../services/utils.service';
import { ConversationHubService } from 'src/app/api/conversation-hub.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { MessagingService } from '../services/messaging.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})

export class ResourcesComponent implements OnInit, OnChanges {
  @Input() parentParams: any;
  @Input() isNaviExpanded: boolean = false;
  @Input() product: any;
  params: any;
  productId: any;
  columnDef: any;
  resources: any;
  selectedResources: any = [];
  visible = false;
  prodContext = false;
  tableView = true;
  entity = 'Resources';
  currentUserDetails: any;
  accountId: any;
  resourceDetail: any;
  currentUser: any;
  users: any;
  selectedConversationID: any;
  tableFilterEvent: any;
  linkToResources: boolean = false;
  selectedTab: string = '';
  selectedLeftPanelConversation?: any
  @Input() componentToShow: any;
  showLinkingActions = false;
  clearAllTheSelectedResources = false;

  constructor(private localService: LocalStorageService,
    private utils: UtilsService,
    private conversationHUb: ConversationHubService,
    private messagingService: MessagingService
  ) {
    this.messagingService.getMessage<any>().subscribe((msg: any) => {
      if (msg.msgData && msg.msgType === MessageTypes.ConversationId) {
        msg.msgData.length ? this.selectedConversationID = true : this.selectedConversationID = false;
      }
    });
    this.messagingService.getMessage<any>().subscribe((msg: any) => {
      if (msg.msgType === MessageTypes.ReloadTabList && msg.msgData.componentToShow === this.componentToShow) {
        this.showLinkingActions = false;
        this.handleResourcesResponce(msg.msgData?.list);
      }
    })
  }

  ngOnInit() {
    this.currentUser = this.localService.getItem(StorageKeys.CurrentUser);
    this.users = this.localService.getItem(StorageKeys.USERLIST);
    const conversationDetails: any = this.localService.getItem(StorageKeys.CONVERSATION_DETAILS)
    this.selectedConversationID = conversationDetails?.id;
    this.getResources()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']?.currentValue) {
      this.product = changes['product'].currentValue;
      this.getResources()
    }
    if (changes['isNaviExpanded']?.currentValue) {
      this.isNaviExpanded = changes['isNaviExpanded'].currentValue;
    }
  }

  updateLInkedResources(linkedList: any) {
    const commonElements = this.resources.filter((conversation1: any) =>
      linkedList.some((conversation2: any) => conversation1.id === conversation2.id)
    );
    this.resources = commonElements;
    this.handleResourcesResponce(this.resources)
  }

  LinkResources() {
    this.linkToResources = true
  }

  linkedResourcesConversations() {
    this.linkToResources = false
  }

  clearRowsSelection() {
    this.clearAllTheSelectedResources = true;
  }

  checkedResources(event: any) {
    let selectedItems: any = [];
    const references = this.localService.getItem(StorageKeys.CONVERSATION_REFERENCES);
    Array.isArray(references) ? selectedItems = references : event.data.active = true;
    selectedItems.push(event.data)
    if (event?.event?.checked == false) {
      selectedItems?.forEach((element: any) => {
        if ((element.entity_id == event.data.id) || (element.id == event.data.id)) {
          element.active = false;
        }
      });
    }
    // event.event.checked  // event.data
    let activeElems = 0;
    if (selectedItems.length) {
      selectedItems?.forEach((element: any) => {
        this.selectedResources.push(element);
      })
    }
    if (this.selectedResources.length) {
      this.selectedResources?.forEach((element: any) => {
        element.active ? activeElems = +1 : '';
      })
    }
    activeElems > 0 ? this.visible = true : this.visible = false;
  }

  getResources() {
    this.utils.loadSpinner(true)
    const convoRef: any = this.localService.getItem(StorageKeys.CONVERSATION_REFERENCES);
    const resources = new ResourcesTableColumn()
    this.columnDef = resources.getColumns();
    if (this.product?.id) {
      this.getResourcesByProductId(convoRef, { productId: this.product?.id });
    } else {
      const accountId = this.currentUser?.account_id ? this.currentUser?.account_id : this.parentParams.account_id;
      const userId = this.currentUser?.user_id ? this.currentUser?.user_id : this.parentParams.user_id;
      this.getResourcesByUserId({ accountId: accountId, userId: userId })
    }
  }

  handleResourcesResponce(res: any) {
    res?.data ? res = res?.data : res = res;
    const conversationDetails: any = this.localService.getItem(StorageKeys.CONVERSATION_DETAILS)
    this.selectedConversationID = conversationDetails?.id;
    const convoRef: any = this.localService.getItem(StorageKeys.CONVERSATION_REFERENCES);
    if (this.selectedConversationID && Array.isArray(convoRef)) {
      if (convoRef?.length > 0) {
        convoRef.forEach((item: any) => {
          if (item.entity_type === "resource") {
            res?.some((apidata: any) => {
              if (apidata.id == item.entity_id && item.active) {
                apidata.checked = true
              }
            })
          }
        });
        res?.sort((a: any, b: any) => {
          if (a.checked === b.checked) { return 0; }
          if (a.checked) { return -1; }
          return 1;
        });
      } else {
        res?.forEach((item: any) => { item.checked = false });
      }
      this.selectedResources = _.filter(res, { checked: true });
    }
    this.resources = res;
    if (this.parentParams?.resource_id) {
      const resource = this.resources.find((element: any) => element.id === this.parentParams.resource_id);

      if (resource) {
        this.onIdClick(resource);
      }
    }
  }

  getResourcesByUserId(params: any): void {
    this.conversationHUb.getResourcesByUserId(params).then((res: any) => {
      if (res?.data) {
        this.handleResourcesResponce(res?.data)
      }
      else this.utils.loadToaster({ severity: 'error', summary: '', detail: res.message })
      this.utils.loadSpinner(false);
    })
  }

  getResourcesByProductId(convoRef: any, params: any): void {
    this.conversationHUb.getResources(params).subscribe((res: any) => {
      if (res?.data) {
        if (this.selectedConversationID && Array.isArray(convoRef)) {
          convoRef.forEach((ref: any) => {
            res?.data.some((obj: any, index: any) => { if (obj.id === ref.entity_id && ref.entity_type == "resource") { obj.checked = true; const subObject = res?.data.splice(index, 1)[0]; res?.data.unshift(subObject); this.visibleEmitter(true) } })
          })
        }
        this.handleResourcesResponce(res?.data)
      }
      else this.utils.loadToaster({ severity: 'error', summary: '', detail: res.message })
      this.utils.loadSpinner(false)
    })
  }

  visibleEmitter(event: any) {
    if (event)
      this.visible = event;
  }

  onRowSelect(event: any) {
    this.selectedResources = event;
    if (this.selectedResources?.length > 0) {
      this.visible = true;
    }
    this.showLinkingActions = this.checkRibbonVisible();
    this.clearAllTheSelectedResources = false;
  }

  onRowUnselect(event: any) {
    this.selectedResources = event;
    if (this.selectedResources?.length == 0) {
      this.visible = false;
    }
    this.showLinkingActions = this.checkRibbonVisible()
  }

  checkRibbonVisible() {
    const convoRef: any = this.localService.getItem(StorageKeys.CONVERSATION_REFERENCES);
    const activeObjects = _.filter(convoRef, { active: true, entity_type: 'resource' });
    const activeEntityIds = _.map(activeObjects, 'entity_id');
    const selectedIds = _.map(this.selectedResources, 'id');
    const haveSameIds = _.intersection(activeEntityIds, selectedIds).length === _.uniq(activeEntityIds.concat(selectedIds)).length;
    return !haveSameIds;
  }

  onIdClick(event: any) {
    this.resourceDetail = event;
    this.tableView = false;
  }
  importFilePopup() {
    window.parent.postMessage(
      { message: 'import-file-popup' },
      this.parentParams?.targetUrl
    );
  }
  searchFilter(event: any) {
    this.tableFilterEvent = event;
  }
}
