import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api/auth.service';
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
  paramEmail: any;
  confirmPasswordValidator: boolean = false;
  errorMessage!: string;
  messages: any = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private utilsService: UtilsService, private route: ActivatedRoute) {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validator: ConfirmPasswordValidator("password", "confirmpassword")
    });
    this.route.queryParams.subscribe((params: any) => {
      this.paramEmail = params.email;
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
    this.utilsService.loadSpinner(true);
    this.apiService.patchAuth('', "auth/beta/resetpassword/" + this.paramEmail + '?password=' + this.resetPasswordForm.get('password')?.value)
      .then((response: any) => {
        if (response?.status === 200) {
          if (response?.data?.detail) {
            this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          } else {
            this.utilsService.loadLoginUser(body);
            this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'success' }); //response.data.message
            this.router.navigate(['/']);
          }
          this.utilsService.loadSpinner(true);
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
          this.utilsService.loadSpinner(true);
        }
      })
      .catch((error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
        this.utilsService.loadSpinner(true);
      });
  }

  onClickSignup() {
    this.router.navigate(['/'])
  }
}
