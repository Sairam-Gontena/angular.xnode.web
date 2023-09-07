import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { RefreshListService } from '../../RefreshList.service';
import { User, UserUtil } from 'src/app/utils/user-util';

@Component({
  selector: 'xnode-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})

export class ConfirmationPopupComponent {
  @Input() Data: any;
  invitationType: string = '';
  visible: boolean = false;
  currentUser?: any;

  constructor(private apiService: ApiService, private utilsService: UtilsService, private refreshListService: RefreshListService,) {
    this.currentUser = UserUtil.getCurrentUser();
  }


  ngOnChanges(changes: SimpleChanges): void {
    let data = localStorage.getItem('currentUser')
    if (data) {
      let data1 = JSON.parse(data)
      this.currentUser = data1;
    }
    if (this.Data) {
      this.invitationType = this.Data.type + ' ' + this.Data.userData.prospect_info.first_name + ' ' + this.Data.userData.prospect_info.last_name;
      this.showDialog()
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
    this.apiService.patchAuth(body, url)
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
