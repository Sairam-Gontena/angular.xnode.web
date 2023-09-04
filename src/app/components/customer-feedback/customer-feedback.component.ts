import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';

@Component({
  selector: 'xnode-customer-feedback',
  templateUrl: './customer-feedback.component.html',
  styleUrls: ['./customer-feedback.component.scss']
})
export class CustomerFeedbackComponent implements OnInit {

  public getScreenWidth: any;
  public dialogWidth: string = '40vw';
  modalPosition: any;
  @Input() showDialog = false;
  @Input() displayReportDialog = false;
  @Output() dataActionEvent = new EventEmitter<any>();
  @Output() onCloseDialog = new EventEmitter<boolean>();
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 780) {
      this.modalPosition = 'bottom';
      this.dialogWidth = '100vw';
    } else if (this.getScreenWidth > 780 && this.getScreenWidth < 980) {
      this.modalPosition = 'center'
      this.dialogWidth = '75vw';
    } else if (this.getScreenWidth > 980) {
      this.modalPosition = 'center'
      this.dialogWidth = '40vw';
    }
  }

  generalFeedbackDialog: boolean = false;

  constructor(private captureService: NgxCaptureService) {
    this.onWindowResize();
  }
  ngOnInit(): void {
  }

  handleDataAndAction(value: any) {
    this.dataActionEvent.emit({ value: 'reportBug' })
  }
  generalHandleDataAndAction(value: any) {
    this.dataActionEvent.emit({ value: 'generalFeedback' })
  }
}
