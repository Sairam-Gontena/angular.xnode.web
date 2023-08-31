import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxCaptureService } from 'ngx-capture';
import { ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/api/api.service';
import { WebSocketService } from 'src/app/web-socket.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'xnode-general-feedback',
  templateUrl: './general-feedback.component.html',
  styleUrls: ['./general-feedback.component.scss']
})
export class GeneralFeedbackComponent implements OnInit {
  @Input() generalFeedbackDialog = false;
  // generalFeedbackDialog = true;
  @Input() showDialog = false;
  @Input() screenshot: any;

  thanksDialog: boolean = false;
  generalFeedbackForm: FormGroup;
  submitted: boolean = false;
  isFormSubmitted: boolean = false;
  isInvalid: boolean = false;
  value!: number;

  constructor(private apiService: ApiService, private utilsService: UtilsService,
    private router: Router, private webSocketService: WebSocketService,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private captureService: NgxCaptureService) {
    this.generalFeedbackForm = this.fb.group({
      product: ['', Validators.required],
      section: ['', Validators.required],
      priority: ['', Validators.required],
      tellUsMore: ['', Validators.required],
      logoFile: [null, Validators.required]
    });
  }
  get feedback() {
    return this.generalFeedbackForm.controls;
  }
  ngOnInit(): void {
  }

  sendFeedback() {
    this.showDialog = false;
    this.thanksDialog = true;
    this.generalFeedbackDialog = false;
    this.submitted = true;
    if (this.generalFeedbackForm.valid) {
      const formValues = this.generalFeedbackForm.value;
      console.log(formValues);

    } else {
      console.log("error");

    }
  }
  customFeedback() {

  }
}
