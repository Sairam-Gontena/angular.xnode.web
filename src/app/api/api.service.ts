import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  endPoint = environment.apiUrl + "crud";
  apiPoint = environment.apiUrl;
  workFlow = environment.workFlowApiUrl + 'api/json-bpmn';
  authEndPoint = environment.authApiUrl;
  constructor() {
  }
  config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  // Temporary
  publishApp(body: any) {
    return axios.post(environment.publishApiUrl, body);
  }

  postWorkFlow(body: any) {
    return axios.post(this.workFlow, body, this.config);
  }

  get(url: string) {
    return axios.get(this.endPoint + url, {
    });
  }

  getApi(url: string) {
    return axios.get(this.apiPoint + url, {
    });
  }

  postApi(body: any, url: string) {
    return axios.post(this.apiPoint + url, body, this.config);
  }

  post(body: any, url: string) {
    return axios.post(this.endPoint + url, body, this.config);
  }


  patch(body: any, url: string) {
    return axios.patch(this.endPoint + url, body, this.config);
  }
}
