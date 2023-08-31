import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { WebSocketService } from 'src/app/web-socket.service';
import { UtilsService } from '../services/utils.service';
import { tap } from 'rxjs';

@Component({
  selector: 'xnode-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.scss']
})
export class ReportBugComponent implements OnInit {
  @Input() displayReportDialog = false;
  @Input() showDialog = false;
  // @Input() thanksDialog = false;
  @Input() screenshot: any;

  submitted: boolean = false;
  isFormSubmitted: boolean = false;
  isInvalid: boolean = false;
  feedbackForm: FormGroup;
  thanksDialog: boolean = false;

  constructor(private apiService: ApiService, private utilsService: UtilsService,
    private router: Router, private webSocketService: WebSocketService,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private captureService: NgxCaptureService) {
    this.feedbackForm = this.fb.group({
      product: ['', Validators.required],
      section: ['', Validators.required],
      priority: ['', Validators.required],
      helpUsImprove: ['', Validators.required],
      logoFile: [null, Validators.required]
    });
  }
  get feedback() {
    return this.feedbackForm.controls;
  }

  ngOnInit(): void {

  }
  feedbackReport() {
    this.showDialog = false;
    this.displayReportDialog = false;
    this.thanksDialog = !this.thanksDialog;
    this.submitted = true;
    this.isFormSubmitted = true;
    if (this.feedbackForm.valid) {
      this.isInvalid = false;
      const formValues = this.feedbackForm.value;
      console.log(formValues);

    } else {
      this.isInvalid = true;
      console.log("error");

    }
  }
  customFeedback() {
    this.showDialog = true;
    this.displayReportDialog = false;

  }


}
