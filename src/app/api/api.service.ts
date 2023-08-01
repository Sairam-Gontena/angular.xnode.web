import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  endPoint = environment.xpilotUrl + "crud";
  workFlow = environment.workFlowUrl + 'api/json-bpmn';
  constructor() {
  }

  config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  // Temporary
  publishApp(body: any) {
    return axios.post(environment.publishUrl, body);
  }

  postWorkFlow(body: any) {
    return axios.post(this.workFlow, body, this.config);
  }

  get(url: string) {
    return axios.get(this.endPoint + url, {
    });
  }
  patch(body: any) {
    return axios.patch(this.endPoint + '/update_product_url', body)
  }

}
