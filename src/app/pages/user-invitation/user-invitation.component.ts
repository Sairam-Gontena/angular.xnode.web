import { Component } from '@angular/core';
import { ApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import TableData from '../../../assets/json/table_users.json'
import { RefreshListService } from '../../RefreshList.service'
@Component({
  selector: 'xnode-user-invitation',
  templateUrl: './user-invitation.component.html',
  styleUrls: ['./user-invitation.component.scss']
})
export class UserInvitationComponent {
  cols: any[] = [];
  usersList: any;

  constructor(private apiService: ApiService, private utilsService: UtilsService, private refreshListService: RefreshListService) {
    this.refreshListService.RefreshAdminUserList().subscribe((data) => {
      if (data) {
        this.getAllUsers()
      }
    });
  }

  ngOnInit(): void {
    // this.utilsService.loadSpinner(true)
    this.getAllUsers()
    this.cols = TableData.Columns;
  }

  getAllUsers(): void {
    let url = 'get_users/' + 'dev.xnode@salientminds.com'
    this.apiService.getData(url)
      .then((response: any) => {
        this.utilsService.loadSpinner(false)
        if (response?.status === 200) {
          if (response?.data) {
            this.usersList = response.data;
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