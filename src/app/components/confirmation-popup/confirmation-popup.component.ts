import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AuthApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { RefreshListService } from '../../RefreshList.service';
import { UserUtil } from 'src/app/utils/user-util';
import { AuditutilsService } from 'src/app/api/auditutils.service'



@Component({
  selector: 'xnode-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})

export class ConfirmationPopupComponent implements OnInit {
  @Input() data: any;
  @Output() confirmationAction = new EventEmitter<boolean>();
  @Output() toggleAlert = new EventEmitter<boolean>();
  @Input() visibleAlert: boolean = false;
  @Input() activeIndex?: number;
  notUserRelated: boolean = false;
  header: any;
  invitationType: string = '';
  showPopup: boolean = false;
  currentUser?: any;

  constructor(private authApiService: AuthApiService, private utilsService: UtilsService, private refreshListService: RefreshListService, private auditUtil: AuditutilsService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    if (this.data === 'showDeletePopup') {
      this.notUserRelated = true;
      this.header = 'Confirmation';
      this.activeIndex == 0 ? this.invitationType = 'delete this comment' : this.invitationType = 'delete this task';
      this.showPopup = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    let localData = localStorage.getItem('currentUser')
    if (localData) {
      let parsedData = JSON.parse(localData)
      this.currentUser = parsedData;
    }
    const userData = changes['data'].currentValue.userData;
    if (this.data && this.data != 'showDeletePopup') {
      this.invitationType = this.data?.type + ' ' + userData?.first_name + ' ' + userData?.last_name;
    }
    this.showDialog();
  }

  confirmDelete() {
    this.visibleAlert = false
    this.confirmationAction.emit(false);
  }

  showDialog() {
    this.showPopup = true;
  }

  onSuccess(): void {
    if (this.data.type === 'Invite') {
      this.updateUserId(this.data.userData.id, 'Invited')
    } else if (this.data.type === 'Hold') {
      this.updateUserId(this.data.userData.id, 'OnHold')
    } else if (this.data.type === 'Reject') {
      this.updateUserId(this.data.userData.id, 'Rejected')
    } else if (this.data.type === 'Delete') {
      this.deleteUserByEmail(this.data.userData.email)
    }
    this.showPopup = false;
  }

  onReject(): void {
    if (this.data === 'showDeletePopup') {
      this.toggleAlert.emit(false);
      this.visibleAlert = false;
    } else {
      this.showPopup = false;
    }
  }

  updateUserId(id: string, action: string): void {
    this.utilsService.loadSpinner(true)
    let url = 'auth/prospect/prospect_status_update';
    let body = {
      "id": id,
      "action": action,
      "admin_email": this.currentUser?.email
    };
    this.authApiService.patchAuth(body, url)
      .then((response: any) => {
        if (response?.status === 200 && !response?.data?.detail) {
          if (response?.data) {
            this.updateProductTier();
          } else {
            this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          }
          this.auditUtil.postAudit(action, 1, 'SUCCESS', 'user-audit');
        } else {
          this.auditUtil.postAudit(action + '_' + response.data.detail, 1, 'FAILURE', 'user-audit');
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
        this.utilsService.loadSpinner(false);
        this.auditUtil.postAudit(action + '_' + error, 1, 'FAILURE', 'user-audit');
      });
  }
  deleteUserByEmail(email: string): void {
    this.utilsService.loadSpinner(true)
    let url = '/user/delete_user/' + email;
    this.authApiService.delete(url)
      .then((response: any) => {
        if (response?.status === 200 && !response?.data?.detail) {
          this.refreshListService.toggleAdminUserListRefresh();
          this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'User has been deleted successfully' });
          this.auditUtil.postAudit('DELETE_USER_FROM_USERMANAGEMENT', 1, 'SUCCESS', 'user-audit');
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          this.auditUtil.postAudit('DELETE_USER_FROM_USERMANAGEMENT_' + response.data.detail, 1, 'FAILURE', 'user-audit');
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
        this.utilsService.loadSpinner(false);
        this.auditUtil.postAudit('DELETE_USER_FROM_USERMANAGEMENT' + '_' + error, 1, 'FAILURE', 'user-audit');
      });
  }

  updateProductTier(): void {
    let url = 'auth/prospect/product_tier_manage/' + this.data.userData.email;
    this.authApiService.put(url)
      .then((response: any) => {
        if (response?.status === 200) {
          if (response?.data) {
            this.refreshListService.toggleAdminUserListRefresh();
            this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'User has been invited successfully' });
          } else {
            this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          }
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
        this.utilsService.loadSpinner(false);
      });
  }

  getMeHeader(header: any) {
    return header.toUppercase();
  }

}
