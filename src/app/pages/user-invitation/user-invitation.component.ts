import { Component } from '@angular/core';
import { AuthApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import TableData from '../../../assets/json/table_users.json'
import { RefreshListService } from '../../RefreshList.service'
import { MenuItem } from 'primeng/api';
import { AuditutilsService } from 'src/app/api/auditutils.service'


@Component({
  selector: 'xnode-user-invitation',
  templateUrl: './user-invitation.component.html',
  styleUrls: ['./user-invitation.component.scss']
})
export class UserInvitationComponent {
  cols: any[] = [];
  usersList: any;
  Actions: any[] = [];
  items: MenuItem[] | undefined;
  currentUser: any;

  constructor(private authApiService: AuthApiService, private utilsService: UtilsService, private refreshListService: RefreshListService, private auditUtil: AuditutilsService,) {
    this.refreshListService.RefreshAdminUserList().subscribe((data) => {
      if (data) {
        this.getAllUsers()
      }
    });
  }

  ngOnInit(): void {
    this.utilsService.loadSpinner(true)
    this.getAllUsers()
    this.cols = TableData.Columns;
    this.Actions = TableData.Actions;
    this.items = [{ label: 'Home' }, { label: 'Accounts' }, { label: 'Beta Users' }];

  }

  getAllUsers(): void {
    this.currentUser = localStorage.getItem('currentUser');
    if (this.currentUser) {
      this.currentUser = JSON.parse(this.currentUser)
      let url = 'user/' + this.currentUser.email
      this.authApiService.getData(url)
        .then((response: any) => {
          this.utilsService.loadSpinner(false)
          if (response?.status === 200) {
            if (response?.data) {
              let data = response.data.map((item: any) => {
                let obj = { id: item.id, action: item.prospect_status, prospect_status_id: item.prospect_status_id, created_on: item.created_on, modified_on: item.modified_on }
                let prospect_info = item.prospect_info
                return { ...obj, ...prospect_info }
              })
              this.usersList = data;
            } else {
              this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
            }
            this.auditUtil.post("USERLIST_FOR_USERMANAGEMENT", 1, 'SUCCESS', 'user-audit');
          } else {
            this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
            this.auditUtil.post("USERLIST_FOR_USERMANAGEMENT_" + response.data.detail, 1, 'FAILURE', 'user-audit');
          }
        })
        .catch((error: any) => {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
          this.utilsService.loadSpinner(false)
          this.auditUtil.post("USERLIST_FOR_USERMANAGEMENT_" + error, 1, 'FAILURE', 'user-audit');
        });
    }


  }
}