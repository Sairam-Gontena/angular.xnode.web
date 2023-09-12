import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/components/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuditutilsService {
  endPoint = environment.userUtilsApi;
  currentUser: any;
  constructor(private utilsService: UtilsService,) { }

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUser');
  }

  post(activity: any, attemptcount: number, attemptstatus: string, url: string) {
    const body = {
      "userId": this.currentUser?.id,
      "activityTypeId": activity,
      "attemptCount": attemptcount,
      "attemptSuccess": attemptstatus
    }
    axios.post(this.endPoint + url, body).then(response => {
      if (response?.status !== 200 && response?.data) {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail })
      }
    }).catch((error) => {
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error?.response?.data?.detail });
    })
  }
}
