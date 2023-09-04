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
  modalPosition: any;
  @Input() showDialog = false;
  @Input() displayReportDialog = false;
  @Output() dataActionEvent = new EventEmitter<any>();
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenWidth < 780 ? this.modalPosition = 'bottom' : this.modalPosition = 'center';
  }

  generalFeedbackDialog: boolean = false;

  constructor(private captureService: NgxCaptureService) {

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
