import { Component, HostListener, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xnode-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss']
})

export class FeedbackListComponent {
  @Input() visible: any;
  public getScreenWidth: any;
  public dialogWidth: string = '80vw';
  areaTypes: any[] = [{ label: 'Reported Bug', value: 'USER_BUG_REPORT' }, { label: 'General Feedback', value: 'USER_FEEDBACK' }];
  selectedArea: any;
  formGroup!: FormGroup;
  reportList: any;
  selectedListItem: any;
  selectedIndex: any = 0;
  currentUser: any;
  showMessageBox: boolean = false;
  conversationForm = {
    message: ''
  }
  email: any;
  productId: any;
  user: any;
  conversationSourceId: any;
  parentConversationId: any;
  selectedItemConversation: any;
  message: any;
  modalPosition: any;
  reportItem: any;
  deepLinkId: string = ''
  deepLinkType: string = ''

  constructor(
    public utils: UtilsService,
    private userUtilService: UserUtilsService,
    private auditUtil: AuditutilsService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    let queryParams = this.route.snapshot.queryParams;
    if (queryParams['type']?.length > 0 && queryParams['id']?.length > 0) {
      this.deepLinkId = queryParams['id'];
      if (queryParams['type'] == 'user-feedback') {
        this.deepLinkType = 'USER_FEEDBACK'
      } else if (queryParams['type'] == 'user-bug-report') {
        this.deepLinkType = 'USER_BUG_REPORT'
      }
    } else {
      this.selectedArea = 'USER_BUG_REPORT';
      this.utils.loadSpinner(true);
      this.getMeReportedBugList();
    }
    this.onWindowResize();
    let user = localStorage.getItem('currentUser')
    if (user) {
      this.user = JSON.parse(user)
      this.email = this.user?.email;
    }
    let product = localStorage.getItem('product')
    if (product) {
      let productObj = JSON.parse(product)
      this.productId = productObj?.id;
    }
    this.utils.getMeUpdatedList.subscribe((event: any) => {
      if (event)
        this.getMeConversations();
    })
    this.modalPosition = 'center'
  }


  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    this.utils.loadSpinner(true);
    if (this.deepLinkType == 'USER_BUG_REPORT') {
      this.getMeReportedBugList()
    } else if (this.deepLinkType == 'USER_FEEDBACK') {
      this.getMeGeneralFeedbackList()
    } else {
      this.getMeReportedBugList()
    }
    if (this.deepLinkType == 'USER_BUG_REPORT' || this.deepLinkType == 'USER_FEEDBACK') {
      this.selectedArea = this.deepLinkType
    } else {
      this.selectedArea = 'USER_BUG_REPORT'
    }
  }

  onClickClose() {
    this.location.back();
  }

  onClickSend() {
    this.utils.loadSpinner(true);
    let payload = {
      "userId": this.user?.user_id,
      "conversationSourceType": this.selectedArea,
      "conversationSourceId": this.conversationSourceId,
      "message": this.message,
      "parentConversationId": this.selectedItemConversation.length === 0 ? null : this.selectedItemConversation[0].id,
      "conversationSourceUserId": this.selectedListItem.userId
    }
    this.userUtilService.post(payload, 'user-conversation').then((res: any) => {
      if (res && res?.data) {
        this.getMeConversations();
        this.message = '';
        this.showMessageBox = false;
      }
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      this.utils.loadToaster({ severity: 'error', summary: '', detail: err });
      this.utils.loadSpinner(false);
    })
  }

  getMeTitle(report: any) {
    if (report?.productName && report?.componentId) {
      return report?.productName + "-" + report?.componentId
    } else {
      return report?.componentId
    }
  }

  onSelectListItem(report: any, index: Number, onInit?: boolean) {
    this.selectedListItem = report;
    this.reportItem = report;
    this.message = '';
    this.selectedIndex = index;
    this.conversationSourceId = report?.id
    this.getMeConversations();
    if (onInit == false && this.getScreenWidth < 980) {
      this.visible = true;
    }
  }

  getMeUserAvatar(report?: any) {
    let words: any;
    if (report) {
      words = report?.userName?.split(" ");
    } else {
      words = [this.currentUser?.first_name, this.currentUser?.last_name];
    }
    if (words?.length >= 2) {
      var firstLetterOfFirstWord = words[0][0].toUpperCase(); // Get the first letter of the first word
      var firstLetterOfSecondWord = words[1][0].toUpperCase(); // Get the first letter of the second word
      return firstLetterOfFirstWord + firstLetterOfSecondWord
    }
  }
  getMeMyAvatar(currentUser?: any) {
    return currentUser.first_name.charAt(0).toUpperCase() + currentUser.last_name.charAt(0).toUpperCase()
  }

  getMeConversations(): void {
    this.utils.loadSpinner(true);
    this.userUtilService.getData('user-conversation/' + this.selectedListItem.id).then((res: any) => {
      if (res.status == 200) {
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL,
        }
        this.auditUtil.post('SELECT_ITEM_USER_CONVERSATION_FEEDBACK', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
        if (res.data) {
          this.selectedItemConversation = res.data.slice().reverse();
        }
      } else {
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL,
        }
        this.auditUtil.post('SELECT_ITEM_USER_CONVERSATION_FEEDBACK', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      }
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'GET',
        'url': err?.request?.responseURL,
      }
      this.auditUtil.post('GET_TOTAL_ONBOARDED_APPS_MY_PRODUCTS', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.utils.loadSpinner(false);
    })
  }

  onChangeArea(event: any) {
    this.utils.loadSpinner(true);
    this.selectedArea = event.value;
    this.selectedIndex = 0;
    if (event.value === 'USER_BUG_REPORT') {
      this.getMeReportedBugList();
    } else {
      this.getMeGeneralFeedbackList()
    }
    this.deepLinkId = ''
    this.deepLinkType = ''
  }

  getMeReportedBugList(): void {
    this.userUtilService.get('user-bug-report').then((res: any) => {
      if (res) {
        this.conversationSourceId = res?.data?.[0]?.id;
        this.reportList = res.data;
        this.reportItem = res.data[0];
        if (res?.data.length) {
          if (this.deepLinkId.length > 0) {
            this.selectedListItem = res.data.filter((item: any) => item.id === this.deepLinkId)[0];
            let selectedIndex = res.data.findIndex((item: any) => item.id === this.deepLinkId);
            this.onSelectListItem(this.selectedListItem, selectedIndex, true)
          } else {
            this.selectedListItem = res.data[0];
            this.onSelectListItem(this.selectedListItem, 0, true)
          }
        }
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.post('GET_REPORTED_BUG_LIST_EXISTING_FEEDBACK', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
      } else {
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.post('GET_REPORTED_BUG_LIST_EXISTING_FEEDBACK', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data?.detail });
      }
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'GET',
        'url': err?.request?.responseURL
      }
      this.auditUtil.post('GET_REPORTED_BUG_LIST_EXISTING_FEEDBACK', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  getMeGeneralFeedbackList(): void {
    this.userUtilService.get('/user-feedback').then((res: any) => {
      this.reportList = res.data;
      this.reportItem = res.data[0];
      if (res) {
        if (res?.data.length) {
          if (this.deepLinkId.length > 0) {
            this.selectedListItem = res.data.filter((item: any) => item.id === this.deepLinkId)[0];
            let selectedIndex = res.data.findIndex((item: any) => item.id === this.deepLinkId);
            this.onSelectListItem(this.selectedListItem, selectedIndex, true)
            setTimeout(() => {
              this.scrollToItem(this.deepLinkId)
            }, 1000)
          } else {
            this.selectedListItem = res.data[0];
            this.onSelectListItem(this.selectedListItem, 0, true)
          }
          this.conversationSourceId = res?.data?.[0]?.id;
        }
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.post('GET_GENERAL_FEEDBACK_LIST_EXISTING_FEEDBACK', 1, 'SUCCESS', 'user-audit', user_audit_body, this.email, this.productId);
      } else {
        let user_audit_body = {
          'method': 'GET',
          'url': res?.request?.responseURL
        }
        this.auditUtil.post('GET_GENERAL_FEEDBACK_LIST_EXISTING_FEEDBACK', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data?.detail });
      }
      this.utils.loadSpinner(false);
      this.getMeConversations();
    }).catch((err: any) => {
      let user_audit_body = {
        'method': 'GET',
        'url': err?.request?.responseURL
      }
      this.auditUtil.post('GET_GENERAL_FEEDBACK_LIST_EXISTING_FEEDBACK', 1, 'FAILED', 'user-audit', user_audit_body, this.email, this.productId);
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  @HostListener('window:resize', ['$event'])

  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 780) {
      this.dialogWidth = '85vw';
    } else if (this.getScreenWidth > 780 && this.getScreenWidth < 980) {
      this.dialogWidth = '75vw';
    } else if (this.getScreenWidth > 980) {
      this.dialogWidth = '75vw';
    }
  }

  closePopup() {
    this.utils.showFeedbackPopupByType('');
    this.visible = false;
  }

  scrollToItem(itemId: string) {
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}