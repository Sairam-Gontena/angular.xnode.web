import { Component } from '@angular/core';

@Component({
  selector: 'xnode-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent {
  otp: any;

  onOtpChange(otp:any) {
    this.otp = otp;
  }
}
