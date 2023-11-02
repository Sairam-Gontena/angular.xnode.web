import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  endPoint = environment.apiUrl;
  apiPoint = environment.apiUrl;
  workFlow = environment.workFlowApiUrl + 'api/json-bpmn';
  authEndPoint = environment.authApiUrl;
  commentsEndPoint = environment.commentsApiUrl;

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

  getAuthApi(url: string) {
    return axios.get(this.authEndPoint + url, {
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

  patchApi(body: any, url: string) {
    return axios.patch(this.apiPoint + url, body, this.config);
  }

  getComments(url: string, params?: any) {
    return axios.get(this.commentsEndPoint + url, { params: params });
  }

  postComments(body: any, url: string) {
    return axios.post(this.commentsEndPoint + url, body, this.config);
  }

  deleteComment(url: string) {
    return axios.delete(this.commentsEndPoint + url, this.config);
  }
}
