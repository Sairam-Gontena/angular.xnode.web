import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseApiService } from './base-api.service';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { User } from '../utils/user-util';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

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

  private userSubject: BehaviorSubject<User | null>;
  private isLoggedIn = new Subject<boolean>();
  public user: Observable<User | null>;

  constructor(private router: Router, private http: HttpClient) {
    super();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) this.userLoggedIn = true;

    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user = this.userSubject.asObservable();
    this.isLoggedIn.next(false);
  }

  setIsLoggedIn(userLoggedIn: boolean) {
    this.isLoggedIn.next(userLoggedIn);
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
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

  verifyOtp(body?: any) {
    return this.post('mfa/verifyOTP', body);
  }
  resendOtp(body?: any) {
    return this.post('mfa/resendverfication', body);
  }

  resetPassword(body?: any) {
    return this.patch(
      'auth/prospect/resetpassword/' +
      body.email + '?password=' + body.password
    );
  }

  logout() {
    this.http
      .post<any>(
        `${environment.apiUrl}auth/logout`,
        {email: this.userValue?.email},
        { withCredentials: true }
      )
      .subscribe();
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }


  refreshToken() {
    return this.http
      .get<any>(
        `${environment.apiUrl}auth/refresh/${this.userValue?.email}`,
        { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+this.userValue?.refreshToken} }
      )
      .pipe(
        map((resp) => {
          const helper = new JwtHelperService();
          const decodedUser = helper.decodeToken(resp.accessToken);
          decodedUser.accessToken = resp.accessToken;
          decodedUser.refreshToken = resp.refreshToken;
          this.userSubject.next(decodedUser);
          this.startRefreshTokenTimer();
          return decodedUser;
        })
      );
  }

  private refreshTokenTimeout?: any;

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    console.log('userval',this.userValue)
    const jwtBase64 = this.userValue!.accessToken!.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
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
