import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AuthApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { RefreshListService } from '../../RefreshList.service';
import { User, UserUtil } from 'src/app/utils/user-util';
import { AuditutilsService } from '../../api/auditutils.service';


@Component({
  selector: 'xnode-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})

export class ConfirmationPopupComponent implements OnInit {
  @Input() Data: any;
  invitationType: string = '';
  visible: boolean = false;
  currentUser?: any;

  constructor(private authApiService: AuthApiService, private utilsService: UtilsService, private refreshListService: RefreshListService, private auditUtil: AuditutilsService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    if (this.Data) {
      this.invitationType = this.Data.type + ' ' + this.Data.userData.first_name + ' ' + this.Data.userData.last_name;
      this.showDialog()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    let data = localStorage.getItem('currentUser')
    if (data) {
      let data1 = JSON.parse(data)
      this.currentUser = data1;
    }

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
    }
    this.visible = false;
    return
  }
  onReject(): void {
    this.visible = false;
    return
  }

  updateUserId(id: string, action: string): void {
    this.utilsService.loadSpinner(true)
    let url = 'auth/prospect/prospect_status_update';
    let body = {
      "id": id,
      "action": action,
      "admin_email": this.currentUser?.user_details.email
    };
    this.authApiService.patchAuth(body, url)
      .then((response: any) => {
        if (response?.status === 200) {
          if (response?.data) {
            this.updateProductTier();
          } else {
            this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          }
          let userid = this.currentUser?.id
          this.auditUtil.post(userid, action, 'user-audit').then((response: any) => {
            if (response?.status === 200) {
            } else {
              this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail });
            }
          }).catch((err) => {
            this.utilsService.loadToaster({ severity: 'error', summary: '', detail: err });
          })
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
