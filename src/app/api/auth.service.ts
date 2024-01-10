import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})

export class AuthApiService extends BaseApiService {
  override get apiUrl(): string {
    return environment.authApiUrl;
  }
  userLoggedIn = false;
  otpVerifyInprogress = false;
  restInprogress = false;

  constructor() {
    super();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser)
      this.userLoggedIn = true
  }

  authPut(body: any, url: string) {
    this.put(this.apiUrl, body)
  }

  getData(url: string) {
    return this.get(url);
  }

  getAllUsers(url: string) {
    return this.get(url);
  }

  login(body: any, url: string) {
    return this.post(url, body);
  }

  postAuth(body: any, url: string) {
    return this.post(url, body);
  }

  patchAuth(body: any, url: string) {
    return this.patch(url, body);
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

  getUsersByAccountId(params?: any) {
    let url = 'user/get_all_users?account_id=' + params.account_id
    return this.get(url);
  }

}
