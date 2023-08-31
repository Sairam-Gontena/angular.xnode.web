import { Component, Input, OnInit } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';

@Component({
  selector: 'xnode-customer-feedback',
  templateUrl: './customer-feedback.component.html',
  styleUrls: ['./customer-feedback.component.scss']
})
export class CustomerFeedbackComponent implements OnInit {

  @Input() showDialog = false;
  @Input() thanksDialog = false;

  displayReportDialog: boolean = false;
  screenshot!: string;
  generalFeedbackDialog: boolean = false;

  constructor(private captureService: NgxCaptureService) {

  }
  ngOnInit(): void {
  }
  showCustomerFeedback() {
    this.showDialog = false;
    this.displayReportDialog = true;
    this.captureService
      .getImage(document.body, true)
      .pipe(
        tap((img) => {
          this.screenshot = img;
        })
      )
      .subscribe();
  }
  showGeneralFeedback() {
    this.showDialog = false;
    this.generalFeedbackDialog = true;
    this.captureService
      .getImage(document.body, true)
      .pipe(
        tap((img) => {
          this.screenshot = img;
        })
      )
      .subscribe();
  }
}
