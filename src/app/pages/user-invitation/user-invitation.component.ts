import { Component } from '@angular/core';
import { ApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import TableData from '../../../assets/json/table_users.json'
import { RefreshListService } from '../../RefreshList.service'
import { MenuItem } from 'primeng/api';
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

  constructor(private apiService: ApiService, private utilsService: UtilsService, private refreshListService: RefreshListService) {
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
      let url = 'user/' + this.currentUser.user_details.email
      this.apiService.getData(url)
        .then((response: any) => {
          this.utilsService.loadSpinner(false)
          if (response?.status === 200) {
            if (response?.data) {
              let data = response.data.map((item: any) => {
                let obj = { id: item.id, action: item.prospect_status, prospect_status_id: item.prospect_status_id }
                let prospect_info = item.prospect_info
                return { ...obj, ...prospect_info }
              })
              this.usersList = data;
            } else {
              this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
            }
          } else {
            this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          }
        })
        .catch((error: any) => {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
          this.utilsService.loadSpinner(false)
        });
    }


  }
}