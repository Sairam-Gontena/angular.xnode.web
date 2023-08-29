import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { RefreshListService } from '../../RefreshList.service';

@Component({
  selector: 'xnode-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent {

  @Input() Data: any;
  invitationType: string = '';
  visible: boolean = false;


  constructor(private apiService: ApiService, private utilsService: UtilsService, private refreshListService: RefreshListService,) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.Data) {
      this.invitationType = this.Data.type + ' ' + this.Data.userData.first_name;
      this.showDialog()
    }
  }


  showDialog() {
    this.visible = true;
  }

  onSuccess(): void {
    if (this.Data.type === 'invite') {
      this.updateUserId(this.Data.userData.id, 'invited')
    } else if (this.Data.type === 'hold') {
      this.updateUserId(this.Data.userData.id, 'hold')
    } else if (this.Data.type === 'reject') {
      this.updateUserId(this.Data.userData.id, 'rejected')
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
    let url = 'auth/beta/update_user/' + 'dev.xnode@salientminds.com'
    let body = {
      "id": id,
      "action": action
    }
    this.apiService.authPut(body, url)
      .then((response: any) => {
        if (response?.status === 200) {
          if (response?.data) {
            this.refreshListService.toggleAdminUserListRefresh();
          } else {
            this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          }
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
        }
        this.utilsService.loadSpinner(false)

      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
        this.utilsService.loadSpinner(false)

      });
  }

}
