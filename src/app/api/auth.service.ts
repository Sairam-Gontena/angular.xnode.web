import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
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
    if (currentUser) this.userLoggedIn = true;
  }

  isUserLoggedIn() {
    return this.userLoggedIn;
  }

  setUser(event: boolean): void {
    this.userLoggedIn = event;
  }

  login(body: any) {
    return this.post('auth/prospect/login', body);
  }

  forgotPassword(email?: string) {
    return this.post('mfa/forgotpassword?email=' + email);
  }

  signup(body?: any) {
    return this.post('auth/signup', body);
  }

  resetPassword(body?: any) {
    return this.patch(
      'auth/prospect/resetpassword/',
      body.email + '?password=' + body.password
    );
  }

  updateUserId(body: any) {
    return this.patch('auth/prospect/prospect_status_update', body);
  }

  isOtpVerifiedInprogress(event: boolean) {
    this.otpVerifyInprogress = event;
  }

  isResetPasswordInproggress(event: boolean) {
    this.restInprogress = event;
  }

  getUsersByAccountId(params?: any) {
    let url = 'user/get_all_users?account_id=' + params.account_id;
    return this.get(url);
  }

  getAllUsers(account_id?: string) {
    return this.get('user/get_all_users?account_id=' + account_id);
  }

  getUserDetails(email?: string) {
    return this.get('user/' + email);
  }
}
