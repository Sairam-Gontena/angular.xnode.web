import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { ConversationHubService } from 'src/app/api/conversation-hub.service';
import { MessagingService } from 'src/app/components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
@Component({
  selector: 'xnode-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit {
  @ViewChild('ngOtpInput') ngOtpInputRef: any;
  otp: any;
  email: any;
  userEmail!: string;
  resendTimer: number = 60;
  total_apps_onboarded: any;
  restriction_max_value: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private auditUtil: AuditutilsService,
    private authApiService: AuthApiService,
    private storageService: LocalStorageService,
    private messagingService: MessagingService,
    private conversationService: ConversationHubService
  ) { }

  ngOnInit(): void {
    this.userEmail = this.maskEmail(this.route.snapshot.params['email']);
    this.startResendTimer();
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }
  maskEmail(email: string): string {
    const parts = email.split('@');
    const username = parts[0];
    const maskedUsername =
      username.charAt(0) +
      '*'.repeat(username.length - 2) +
      username.charAt(username.length - 1);
    return maskedUsername + '@' + parts[1];
  }
  startResendTimer() {
    const intervalId = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  resendVerification() {
    this.authApiService.isOtpVerifiedInprogress(true);
    this.resendTimer = 60;
    this.otp = '';
    this.ngOtpInputRef.setValue('');
    this.utilsService.loadSpinner(true);
    this.authApiService
      .resendOtp({ email: this.route.snapshot.params['email'] })
      .then((response: any) => {
        if (response?.status === 200) {
          this.startResendTimer();
          this.utilsService.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: response?.data?.Message,
          });
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response.data.detail,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error: any) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
      });
  }

  verifyAccount() {
    this.utilsService.loadSpinner(true);
    if (this.otp?.length == 6) {
      this.authApiService.verifyOtp({ email: this.route.snapshot.params['email'], otp: this.otp }).then(
        (response: any) => {
          if (response?.status === 200 && !response?.data?.detail) {
            this.handleResponse(response.data);
          } else {
            this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
            this.utilsService.loadSpinner(false);
          }
        }).catch((error: any) => {
          this.utilsService.loadSpinner(false);
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error?.response?.data?.detail });
          this.auditUtil.postAudit(
            'VERIFY_OTP_' + error?.response?.data?.detail,
            1,
            'FAILURE',
            'user-audit'
          );
        });
    } else {
      let errMsg = 'Please enter OTP';
      if (this.otp?.length > 0 && this.otp?.length < 6)
        errMsg = 'Please enter your 6 digit OTP';
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: errMsg });
      this.utilsService.loadSpinner(false);
    }
  }

  async handleResponse(data: any) {
    const helper = new JwtHelperService();
    const decodedUser = helper.decodeToken(data?.accessToken);
    this.storageService.saveItem(StorageKeys.CurrentUser, decodedUser);
    this.storageService.saveItem(StorageKeys.ACCESS_TOKEN, data.accessToken);
    this.storageService.saveItem(StorageKeys.REFRESH_TOKEN, data.refreshToken);
    this.messagingService.sendMessage({
      msgType: MessageTypes.ACCESS_TOKEN,
      msgData: { access_token: data.accessToken, from: 'verify-otp' },
    });
    decodedUser.accessToken = data.accessToken;
    decodedUser.refreshToken = data.refreshToken;
    this.authApiService.userSubject.next(decodedUser);
    this.authApiService.setIsLoggedIn(true);
    this.authApiService.startRefreshTokenTimer();
    this.authApiService.isOtpVerifiedInprogress(false);
    if (decodedUser?.role_name === 'Xnode Admin') {
      this.authApiService.setUser(true);
      this.router.navigate(['/admin/user-invitation']);
      this.auditUtil.postAudit(
        'XNODE_ADMIN_VERIFY_OTP',
        1,
        'SUCCESS',
        'user-audit'
      );
    } else {
      await this.getAllProducts();

      this.auditUtil.postAudit('USER_VERIFY_OTP', 1, 'SUCCESS', 'user-audit');
    }
    this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'OTP verified successfully' });
  }

  navigateWithQueryParams(response: any, redirectPath: { pathname: string, params: string }) {
    let product: any;
    const queryString = redirectPath.params.startsWith('?') ? redirectPath.params.slice(1) : redirectPath.params;
    const params = new URLSearchParams(queryString);
    const queryParams: any = {};
    params.forEach((value, key) => {
      queryParams[key] = value;
    });
    if (queryParams.product_id) {
      product = response.data.filter((obj: any) => { return obj.id === queryParams.product_id })[0];
      this.storageService.saveItem(StorageKeys.Product, product);
      this.messagingService.sendMessage({
        msgType: MessageTypes.PRODUCT_CONTEXT,
        msgData: true,
      });
    }
    this.router.navigate([redirectPath.pathname], { queryParams: queryParams });
    this.storageService.removeItem(StorageKeys.REDIRECT_PATH)
  }

  //get calls
  getAllProducts(): void {
    const currentUser: any = this.storageService.getItem(StorageKeys.CurrentUser);
    this.conversationService.getProductsByUser({ accountId: currentUser?.account_id, userId: currentUser?.user_id, userRole: 'all' }).then((response: any) => {
      if (response?.status === 200) {
        const redirectPath: any = this.storageService.getItem(StorageKeys.REDIRECT_PATH);
        this.authApiService.setUser(true);
        if (redirectPath) {
          this.storageService.saveItem(StorageKeys.MetaData, response.data);
          this.navigateWithQueryParams(response, redirectPath)
          this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'OTP verified successfully' });
          return
        }
        this.router.navigate(['/my-products']);
        this.utilsService.loadSpinner(false);
      }
    }).catch((error: any) => {
      this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
      this.utilsService.loadSpinner(false);
    });
  }

  onClickLogout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
    this.auditUtil.postAudit('USER_LOGGED_OUT', 1, 'SUCCESS', 'user-audit');
  }

  getMeCreateAppLimit(): void {
    const currentUser: any = this.storageService.getItem(
      StorageKeys.CurrentUser
    );
    this.authApiService.get('user/get_create_app_limit/' + currentUser?.email)
      .then((response: any) => {
        if (response?.status === 200) {
          this.restriction_max_value = response.data[0].restriction_max_value;
          localStorage.setItem(
            'restriction_max_value',
            response.data[0].restriction_max_value
          );
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: '',
            detail: response.data?.detail,
          });
        }
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: '',
          detail: error,
        });
        this.utilsService.loadSpinner(true);
      });
  }
  backToLogin() {
    this.router.navigate(['/']);
  }
}
