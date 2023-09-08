import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthApiService {
  workFlow = environment.workFlowApiUrl + 'api/json-bpmn';
  authEndPoint = environment.authApiUrl;

  constructor() {
  }

  config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  authPut(body: any, url: string) {
    return axios.put(this.authEndPoint + url, body);
  }

  getData(url: string) {
    return axios.get(this.authEndPoint + url, {
    });
  }

  login(body: any, url: string) {
    return axios.post(this.authEndPoint + url, body, this.config);
  }

  postAuth(body: any, url: string) {
    if (body != '') {
      return axios.post(this.authEndPoint + url, body, this.config);
    } else {
      return axios.post(this.authEndPoint + url, {})
    }
  }

  patchAuth(body: any, url: string) {
    if (body != '') {
      return axios.patch(this.authEndPoint + url, body, this.config);
    } else {
      return axios.patch(this.authEndPoint + url, {});
    }
  }

  //Temp
  get(url: string) {
    return axios.get(this.authEndPoint + url, {
    });
  }

  put(url: string) {
    return axios.get(this.authEndPoint + "crud" + url, {
    });
  }

}
