import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';

@Component({
  selector: 'xnode-customer-feedback',
  templateUrl: './customer-feedback.component.html',
  styleUrls: ['./customer-feedback.component.scss']
})
export class CustomerFeedbackComponent implements OnInit {

  @Input() showDialog = false;
  @Input() displayReportDialog = false;
  @Output() dataActionEvent = new EventEmitter<string>();

  // displayReportDialog: boolean = false;
  screenshot!: string;
  generalFeedbackDialog: boolean = false;

  constructor(private captureService: NgxCaptureService) {

  }
  ngOnInit(): void {

  }
  // showCustomerFeedback() {
  //   this.showDialog = false;
  //   this.displayReportDialog = true;
  //   this.captureService
  //     .getImage(document.body, true)
  //     .pipe(
  //       tap((img) => {
  //         this.screenshot = img;
  //         console.log('checking')
  //       })
  //     )
  //     .subscribe();
  // }
  // showGeneralFeedback() {
  //   this.showDialog = false;
  //   this.generalFeedbackDialog = true;
  //   this.captureService
  //     .getImage(document.body, true)
  //     .pipe(
  //       tap((img) => {
  //         this.screenshot = img;
  //       })
  //     )
  //     .subscribe();
  // }
  handleDataAndAction(value: any) {
    // this.showDialog = false;
    this.dataActionEvent.emit(value)
    // this.displayReportDialog = true;

    console.log(value, "55555555555555555")
  }
  generalHandleDataAndAction(value: any) {
    // this.showDialog = false;
    this.dataActionEvent.emit(value)
    // this.displayReportDialog = true;

    console.log(value, "8888888888")
  }
}
