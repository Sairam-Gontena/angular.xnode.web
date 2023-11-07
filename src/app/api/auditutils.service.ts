import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/components/services/utils.service';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuditutilsService extends BaseApiService {
  override get apiUrl(): string {
    return environment.userUtilsApi
  }
  currentUser: any;
  constructor(private utilsService: UtilsService) {
    super();
  }

  ngOnInit() {
  }

  postAudit(activity: any, attemptcount: number, attemptstatus: string, url: string, activityInfo?: any, useremail?: any, productid?: any) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser)
    }
    const body = {
      "userId": this.currentUser?.user_id,
      "activityTypeId": activity,
      "activityInfo": activityInfo,
      "attemptCount": attemptcount,
      "attemptSuccess": attemptstatus,
      "userEmail": useremail,
      "productId": productid
    }
    this.post(url, body).then(response => {
      if (response.data?.detail) {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail })
      }
    }).catch((error) => {
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error?.response?.data?.detail });
    })
  }
}
