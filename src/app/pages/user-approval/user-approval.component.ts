import { Component } from '@angular/core';
import axios from 'axios';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
@Component({
  selector: 'xnode-user-approval',
  templateUrl: './user-approval.component.html',
  styleUrls: ['./user-approval.component.scss']
})
export class UserApprovalComponent {

  constructor(private apiService: ApiService, private utilsService: UtilsService) {

  }

}
