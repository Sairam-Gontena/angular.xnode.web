import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  otp: any;
  loginResponse: any;
  currentUser: any;
  email: any;

  constructor(private router: Router, private apiService: ApiService, private utilsService: UtilsService) {

  }

  ngOnInit(): void {
    this.utilsService.getMeLoginUser.subscribe((event: any) => {
      this.currentUser = event;
    });
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }
  verifyAccount() {
    this.apiService.login({ email: this.currentUser.email, otp: this.otp }, "mfa/verifyOTP")
      .then((response: any) => {
        if (response) {
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.router.navigate(['/x-pilot']);
          this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Otp verfied successfully' });
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail });
        }
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      });
  }
}
