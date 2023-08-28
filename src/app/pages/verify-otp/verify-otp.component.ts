import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {
  otp: any;
  loginResponse: any;
  currentUser: any;
  email: any;
  maskedEmail!: string;
  resendTimer: number = 60;
  constructor(private router: Router,private apiService:ApiService,private utilsService: UtilsService ){
  
}

  ngOnInit(): void {
    this.utilsService.loadSpinner(true);
    const loginResponseString = localStorage.getItem('currentUser');
    if (loginResponseString) {
       this.loginResponse = JSON.parse(loginResponseString);
    }
    // this.maskedEmail = this.maskEmail(this.loginResponse.email);
    this.maskedEmail = this.maskEmail('mtulasip@gmail.com');

    this.startResendTimer();
  }

  onOtpChange(otp:any) {
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
    this.apiService.login({email:"mtulasip@gmail.com"},"/mfa/resendverfication")
    .then((response :any )=> {
      if (response?.status === 200) {
      this.router.navigate(['/x-pilot']); 

      this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: response.data.detail});
      
      }else{
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail});

      }
      this.utilsService.loadSpinner(false);

    })
    .catch((error:any) => {
      this.utilsService.loadSpinner(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });

    }); 
  }
  verifyAccount(){
    this.apiService.login({email:"mtulasip@gmail.com",otp:this.otp},"/mfa/verifyOTP")
    .then((response :any )=> {
      if (response?.status === 200) {
      this.router.navigate(['/x-pilot']); 

      this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: response.data.detail});
      
      }else{
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail});

      }
      this.utilsService.loadSpinner(false);
    })
    .catch((error:any) => {
      this.utilsService.loadSpinner(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });

    });
  }

  
}

