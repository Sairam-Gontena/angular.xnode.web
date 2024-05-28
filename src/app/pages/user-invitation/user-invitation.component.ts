import { Component } from '@angular/core';
import { AuthApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import TableData from '../../../assets/json/table_columns.json';
import { RefreshListService } from '../../RefreshList.service';
import { MenuItem } from 'primeng/api';
import { AuditutilsService } from 'src/app/api/auditutils.service';

@Component({
  selector: 'xnode-user-invitation',
  templateUrl: './user-invitation.component.html',
  styleUrls: ['./user-invitation.component.scss'],
})
export class UserInvitationComponent {
  cols: any[] = [];
  usersList: any;
  tableInfo: any;
  Actions: any[] = [];
  items: MenuItem[] | undefined;
  currentUser: any;
  DeleteAction: any[] = [
    {
      label: 'Delete',
      backgroundColor: 'Danger',
    },
  ];

  constructor(
    private authApiService: AuthApiService,
    private utilsService: UtilsService,
    private refreshListService: RefreshListService,
    private auditUtil: AuditutilsService
  ) {
    this.refreshListService.RefreshAdminUserList().subscribe((data) => {
      if (data) {
        this.getAllUsers();
      }
    });
  }

  ngOnInit(): void {
    this.utilsService.loadSpinner(true);
    this.getAllUsers();
    this.cols = TableData.user_management.Columns;
    this.Actions = TableData.user_management.Actions;
    this.tableInfo = TableData.user_management.Table_Info;
    this.items = [
      { label: 'Home' },
      { label: 'Accounts' },
      { label: 'Beta Users' },
    ];
  }

  getAllUsers(): void {
    this.authApiService
      .getUserDetails()
      .then((response: any) => {
        this.utilsService.loadSpinner(false);
        if (response?.status === 200) {
          if (response?.data) {
            let user_audit_body = {
              method: 'GET',
              url: response?.request?.responseURL,
            };
            this.auditUtil.postAudit(
              'USER_AUTH',
              1,
              'SUCCESS',
              'user-audit',
              user_audit_body
            );
            let data = response.data.map((item: any) => {
              let obj = {
                id: item.id,
                action: item.prospect_status,
                prospect_status_id: item.prospect_status_id,
                created_on: item.created_on,
                modified_on: item.modified_on,
              };
              let prospect_info = item.prospect_info;
              return { ...obj, ...prospect_info };
            });
            this.usersList = data;
          } else {
            this.utilsService.loadToaster({
              severity: 'error',
              summary: 'ERROR',
              detail: response.data.detail,
            });
          }
          this.auditUtil.postAudit(
            'USERLIST_FOR_USERMANAGEMENT',
            1,
            'SUCCESS',
            'user-audit'
          );
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response.data.detail,
          });
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'USER_AUTH',
            1,
            'FAILED',
            'user-audit',
            user_audit_body
          );
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response.data.detail,
          });
          this.auditUtil.postAudit(
            'USERLIST_FOR_USERMANAGEMENT_' + response.data.detail,
            1,
            'FAILURE',
            'user-audit'
          );
        }
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
        this.utilsService.loadSpinner(false);
        this.auditUtil.postAudit(
          'USERLIST_FOR_USERMANAGEMENT_' + error,
          1,
          'FAILURE',
          'user-audit'
        );
      });
  }
}
