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


  }

  post(activity: any, attemptcount: number, attemptstatus: string, url: string) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser)
    }
    const body = {
      "userId": this.currentUser?.user_id,
      "activityTypeId": activity,
      "attemptCount": attemptcount,
      "attemptSuccess": attemptstatus
    }
    axios.post(this.endPoint + url, body).then(response => {
      if (response.data?.detail) {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail })
      }
    }).catch((error) => {
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error?.response?.data?.detail });
    })
  }
}
