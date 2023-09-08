import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/auth.service';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {
  @ViewChild('ngOtpInput') ngOtpInputRef: any;
  otp: any;
  loginResponse: any;
  currentUser: any;
  email: any;
  maskedEmail!: string;
  resendTimer: number = 60;

  constructor(private router: Router, private apiService: ApiService, private utilsService: UtilsService,
    private userService: UserUtilsService) {

  }

  ngOnInit(): void {
    const loginResponseString = localStorage.getItem('currentUser');
    if (loginResponseString) {
      this.loginResponse = JSON.parse(loginResponseString);
    }
    this.maskedEmail = this.maskEmail(this.loginResponse.email);
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
    this.apiService.login({ email: this.loginResponse.email }, "mfa/resendverfication")
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
    this.apiService.login({ email: this.loginResponse.email, otp: this.otp }, "mfa/verifyOTP")
      .then((response: any) => {
        if (response?.status === 200 && response?.data) {
          if (response?.data?.xnode_role_data.name === 'Xnode Admin') {
            this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: "OTP verified successfully" });
            this.router.navigate(['/admin/user-invitation']);
          } else {
            this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: "OTP verified successfully" });
            this.getAllProducts(response.data);
          }
          this.auditLog(response.data);
          localStorage.setItem('currentUser', JSON.stringify(response?.data));
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          this.utilsService.loadSpinner(true);
        }
      })
      .catch((error: any) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error?.response?.data?.detail });
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
  }

  auditLog(user: any) {
    const body = {
      "userId": user.id,
      "activityTypeId": "VERIFY_OTP",
      "attemptCount": 0,
      "attemptSuccess": "SUCCESS"
    }
    this.userService.post(body, '/user-audit').then((res: any) => {
      if (!res) {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: res?.data.details });
      }
    }).catch(err => {
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    });
  }


}

