import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthApiService {
  workFlow = environment.workFlowApiUrl + 'api/json-bpmn';
  authEndPoint = environment.authApiUrl;
  userLoggedIn = false;
  otpVerifyInprogress = false;
  restInprogress = false;

  constructor() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser)
      this.userLoggedIn = true
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
    return axios.put(this.authEndPoint + url, {
    });
  }

  setUser(event: boolean): void {
    this.userLoggedIn = event;
  }

  isOtpVerifiedInprogress(event: boolean) {
    this.otpVerifyInprogress = event;
  }

  isResetPasswordInproggress(event: boolean) {
    this.restInprogress = event;
  }

  isUserLoggedIn() {
    return this.userLoggedIn;
  }

}
