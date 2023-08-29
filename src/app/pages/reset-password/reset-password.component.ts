import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { ConfirmPasswordValidator } from '../sign-up/confirm-password.validator';

@Component({
  selector: 'xnode-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted: boolean = false;
  confirmPasswordValidator: boolean = false;
  errorMessage!: string;
  messages: any = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private utilsService: UtilsService) {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validator: ConfirmPasswordValidator("password", "confirmpassword")
    });
  }

  ngOnInit(): void {
    this.resetPasswordForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get reset() {
    return this.resetPasswordForm.controls;
  }

  onClick() {
    this.submitted = true;
    let pswdValidator = this.resetPasswordForm.get('confirmpassword')?.errors?.['confirmPasswordValidator'];
    if (pswdValidator) {
      this.confirmPasswordValidator = true;
      return;
    }
    if (this.resetPasswordForm.invalid) {
      return;
    }
    let body = { ...this.resetPasswordForm.value };
    this.apiService.login(body, "auth/login")
      .then((response: any) => {
        if (response?.status === 200) {
          if (response?.data?.detail) {
            this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          } else {
            this.utilsService.loadLoginUser(body);
            this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: response.data.message });
            this.router.navigate(['/verification']);
          }
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
        }
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      });
  }

  onClickSignup() {
    this.router.navigate(['/'])
  }
}
