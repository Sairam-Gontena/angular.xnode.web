import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { AuthApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';

@Component({
  selector: 'xnode-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {
  @ViewChild('ngOtpInput') ngOtpInputRef: any;
  otp: any;
  currentUser: any;
  email: any;
  userEmail!: string;
  resendTimer: number = 60;
  total_apps_onboarded: any;
  restriction_max_value: any;

  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private utilsService: UtilsService,
    private userService: UserUtilsService, private auditUtil: AuditutilsService, private authApiService: AuthApiService) {

  }

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
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
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
    this.resendTimer = 60;
    this.otp = '';
    this.ngOtpInputRef.setValue('');
    this.utilsService.loadSpinner(true);
    this.authApiService.login({ email: this.route.snapshot.params['email'] }, "mfa/resendverfication")
      .then((response: any) => {
        if (response?.status === 200) {
          this.startResendTimer();
          this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: response?.data?.Message });
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error: any) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      });
  }
  verifyAccount() {
    this.utilsService.loadSpinner(true);
    this.authApiService.login({ email: this.route.snapshot.params['email'], otp: this.otp }, "mfa/verifyOTP")
      .then((response: any) => {
        if (response?.status === 200 && response?.data) {
          if (response?.data?.role_id === 'Xnode Admin') {
            this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: "OTP verified successfully" });
            this.router.navigate(['/admin/user-invitation']);
            this.auditUtil.post('XNODE_ADMIN_VERIFY_OTP', 1, 'SUCCESS', 'user-audit');
            localStorage.setItem('currentUser', JSON.stringify(response?.data));
          } else {
            this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: "OTP verified successfully" });
            this.getAllProducts(response.data);
            this.auditUtil.post('USER_VERIFY_OTP', 1, 'SUCCESS', 'user-audit');
            localStorage.setItem('currentUser', JSON.stringify(response?.data));
          }
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          this.utilsService.loadSpinner(true);
          this.auditUtil.post('VERIFY_OTP_' + response.data.detail, 1, 'FAILURE', 'user-audit');
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error: any) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error?.response?.data?.detail });
        this.auditUtil.post('VERIFY_OTP_' + error?.response?.data?.detail, 1, 'FAILURE', 'user-audit');
      });
  }
  //get calls 
  getAllProducts(user: any): void {
    this.apiService.get("/get_metadata/" + user?.email)
      .then((response: any) => {
        if (response?.status === 200) {
          if (response?.data?.data.length > 0) {
            this.router.navigate(['/my-products']);
          } else {
            this.router.navigate(['/x-pilot']);
          }
          this.utilsService.loadSpinner(true);
          this.getMeCreateAppLimit(user);
        }
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
        this.utilsService.loadSpinner(true);
      });
  }

  onClickLogout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
    this.auditUtil.post('USER_LOGGED_OUT', 1, 'SUCCESS', 'user-audit');
  }

  getMeCreateAppLimit(user: any): void {
    this.authApiService.get("/user/get_create_app_limit/" + user?.email)
      .then((response: any) => {
        if (response?.status === 200) {

          this.restriction_max_value = response.data[0].restriction_max_value;
          localStorage.setItem('restriction_max_value', response.data[0].restriction_max_value);
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response.data?.detail });
        }
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
        this.utilsService.loadSpinner(true);
      });
  }
}

