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
  @Output() dataActionEvent = new EventEmitter<any>();

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
