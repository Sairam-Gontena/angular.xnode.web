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
  maskedEmail!: string;
  constructor(private router: Router,private apiService:ApiService,private utilsService: UtilsService ){
  
}

  ngOnInit(): void {
    const loginResponseString = localStorage.getItem('currentUser');
    if (loginResponseString) {
       this.loginResponse = JSON.parse(loginResponseString);
    }
    this.maskedEmail = this.maskEmail(this.loginResponse.email);
  }

  onOtpChange(otp:any) {
    this.otp = otp;
  }
  maskEmail(email: string): string {
    const parts = email.split('@');
    const username = parts[0];
    const maskedUsername = '*'.repeat(username.length);
    return maskedUsername + '@' + parts[1];
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
    })
    .catch((error:any) => {
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });

    });
  }

  
}
