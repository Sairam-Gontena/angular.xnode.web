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
  @Input() Data: any;
  @Output() confirmationPrompt = new EventEmitter<boolean>();
  @Output() toggleAlert = new EventEmitter<boolean>();
  @Input() visibleAlert:boolean=false;
  notUserRelated:boolean=false;
  pDialogHeader:any;
  invitationType: string = '';
  visible: boolean = false;
  currentUser?: any;

  constructor(private authApiService: AuthApiService, private utilsService: UtilsService, private refreshListService: RefreshListService, private auditUtil: AuditutilsService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    if(this.Data==='enableDeletePrompt'){
      this.notUserRelated = true;
      this.pDialogHeader = 'Confirmation';
      this.invitationType = 'delete this comment';
      this.visible = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    let data = localStorage.getItem('currentUser')
    if (data) {
      let parsedData = JSON.parse(data)
      this.currentUser = parsedData;
    }
    const userData = changes['Data'].currentValue.userData;
    if (this.Data && this.Data!='enableDeletePrompt') {
      this.invitationType = this.Data?.type + ' ' + userData?.first_name + ' ' + userData?.last_name;
    }
    this.showDialog();
  }

  confirmPrompt() {
    this.visibleAlert = false
    this.confirmationPrompt.emit(false);
    // call service call to delete comment
  }

  showDialog() {
    this.visible = true;
  }

  onSuccess(): void {
    if (this.Data.type === 'Invite') {
      this.updateUserId(this.Data.userData.id, 'Invited')
    } else if (this.Data.type === 'Hold') {
      this.updateUserId(this.Data.userData.id, 'OnHold')
    } else if (this.Data.type === 'Reject') {
      this.updateUserId(this.Data.userData.id, 'Rejected')
    } else if (this.Data.type === 'Delete') {
      this.deleteUserByEmail(this.Data.userData.email)
    }
    this.visible = false;
  }

  onReject(): void {
    if(this.Data==='enableDeletePrompt'){
      this.toggleAlert.emit(false);
      this.visibleAlert = false;
      console.log('in onreject')
    }else{
      this.visible = false;
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
    let url = 'auth/prospect/product_tier_manage/' + this.Data.userData.email;
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
