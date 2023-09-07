import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuditutilsService {
  endPoint = environment.userUtilsApi;
  constructor() { }

  post(id: any, activity: any, url: string) {
    const body = {
      "userId": id,
      "activityTypeId": activity,
      "attemptCount": 1,
      "attemptSuccess": "SUCCESS"
    }
    return axios.post(this.endPoint + url, body);
  }
}
