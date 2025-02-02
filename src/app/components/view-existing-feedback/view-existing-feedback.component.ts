import { Component, HostListener, Input, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { FormGroup } from '@angular/forms';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { NgForm } from '@angular/forms';
import { AuditutilsService } from 'src/app/api/auditutils.service';
@Component({
  selector: 'xnode-view-existing-feedback',
  templateUrl: './view-existing-feedback.component.html',
  styleUrls: ['./view-existing-feedback.component.scss'],
})
export class ViewExistingFeedbackComponent implements OnInit {
  @Input() visible: any;
  public getScreenWidth: any;
  public dialogWidth: string = '80vw';
  areaTypes: any[] = [
    { label: 'Reported Bug', value: 'USER_BUG_REPORT' },
    { label: 'General Feedback', value: 'USER_FEEDBACK' },
  ];
  selectedArea: any;
  formGroup!: FormGroup;
  reportList: any;
  selectedListItem: any;
  selectedIndex: any = 0;
  currentUser: any;
  showMessageBox: boolean = false;
  conversationForm = {
    message: '',
  };
  email: any;
  productId: any;
  user: any;
  conversationSourceId: any;
  parentConversationId: any;
  selectedItemConversation: any;
  message: any;

  constructor(
    public utils: UtilsService,
    private userUtilService: UserUtilsService,
    private auditUtil: AuditutilsService
  ) {
    this.onWindowResize();
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.user = JSON.parse(user);
      this.email = this.user?.email;
    }
    let product = localStorage.getItem('product');
    if (product) {
      let productObj = JSON.parse(product);
      this.productId = productObj?.id;
    }
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    this.selectedArea = 'USER_BUG_REPORT';
    this.utils.loadSpinner(true);
    this.getMeReportedBugList();
  }

  onClickSend() {
    let payload = {
      userId: this.user?.user_id,
      conversationSourceType: this.selectedArea,
      conversationSourceId: this.conversationSourceId,
      message: this.message,
      parentConversationId:
        this.selectedItemConversation.length === 0
          ? null
          : this.selectedItemConversation[0].id,
    };
    this.userUtilService
      .userConversation(payload)
      .then((res: any) => {
        if (res && res?.data) {
          this.getMeConversations();
          this.message = '';
          this.showMessageBox = false;
        }
      })
      .catch((err: any) => {
        this.utils.loadToaster({ severity: 'error', summary: '', detail: err });
      });
  }

  getMeTitle(report: any) {
    if (report.productName && report.componentId) {
      return report.productName + '-' + report.componentId;
    } else {
      return report.componentId;
    }
  }

  onSelectListItem(report: any, index: Number) {
    this.selectedListItem = report;
    this.message = '';
    this.selectedIndex = index;
    this.conversationSourceId = this.selectedListItem?.id;
    this.getMeConversations();
  }

  getMeConversations(): void {
    this.userUtilService
      .getUserConversation(this.selectedListItem.id)
      .then((res: any) => {
        if (res.status == 200) {
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'SELECT_ITEM_USER_CONVERSATION_FEEDBACK',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
          if (res.data) {
            this.selectedItemConversation = res.data.slice().reverse();
          }
        } else {
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'SELECT_ITEM_USER_CONVERSATION_FEEDBACK',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
        }
      })
      .catch((err: any) => {
        console.log(err);
        let user_audit_body = {
          method: 'GET',
          url: err?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_TOTAL_ONBOARDED_APPS_MY_PRODUCTS',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.email,
          this.productId
        );
      });
  }
  onChangeArea(event: any) {
    this.utils.loadSpinner(true);
    this.selectedArea = event.value;
    this.selectedIndex = 0;
    if (event.value === 'USER_BUG_REPORT') {
      this.getMeReportedBugList();
    } else {
      this.getMeGeneralFeedbackList();
    }
  }

  getMeReportedBugList(): void {
    this.userUtilService
      .get('user-bug-report')
      .then((res: any) => {
        if (res) {
          this.conversationSourceId = res?.data?.[0]?.id;
          this.reportList = res.data;
          if (res?.data.length) {
            this.selectedListItem = res.data[0];
            this.onSelectListItem(this.selectedListItem, 0);
          }
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_REPORTED_BUG_LIST_EXISTING_FEEDBACK',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
        } else {
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_REPORTED_BUG_LIST_EXISTING_FEEDBACK',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res.data?.detail,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err: any) => {
        let user_audit_body = {
          method: 'GET',
          url: err?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_REPORTED_BUG_LIST_EXISTING_FEEDBACK',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.email,
          this.productId
        );
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  getMeGeneralFeedbackList(): void {
    this.userUtilService
      .get('/user-feedback')
      .then((res: any) => {
        if (res) {
          this.reportList = res.data;
          if (res?.data.length) {
            this.selectedListItem = res.data[0];
          }
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_GENERAL_FEEDBACK_LIST_EXISTING_FEEDBACK',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
        } else {
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_GENERAL_FEEDBACK_LIST_EXISTING_FEEDBACK',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.email,
            this.productId
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res.data?.detail,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err: any) => {
        let user_audit_body = {
          method: 'GET',
          url: err?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_GENERAL_FEEDBACK_LIST_EXISTING_FEEDBACK',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.email,
          this.productId
        );
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 780) {
      this.dialogWidth = '100vw';
    } else if (this.getScreenWidth > 780 && this.getScreenWidth < 980) {
      this.dialogWidth = '80vw';
    } else if (this.getScreenWidth > 980) {
      this.dialogWidth = '80vw';
    }
  }

  closePopup() {
    this.utils.showFeedbackPopupByType('');
  }

  onClickReply() {
    this.showMessageBox = true;
  }
}
