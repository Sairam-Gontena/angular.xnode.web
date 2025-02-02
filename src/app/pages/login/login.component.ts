import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
@Component({
  selector: 'xnode-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  loginBtn: boolean = false;
  errorMessage!: string;
  messages: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authApiService: AuthApiService,
    private utilsService: UtilsService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get login() {
    return this.loginForm.controls;
  }
  forgotPassword() {
    this.authApiService.isResetPasswordInproggress(true);
    this.router.navigate(['/forgot-password', this.loginForm.value.email]);
  }

  onClickLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.utilsService.loadSpinner(true);
    let body = { ...this.loginForm.value };
    this.loginBtn = true;
    this.authApiService.login(body).then((response: any) => {
      if (response?.status === 200 && !response?.data?.detail) {
        this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: response.data?.Message });
        this.utilsService.loadSpinner(false);
        this.authApiService.isOtpVerifiedInprogress(true);
        this.loginBtn = false;
        this.router.navigate(['/verify-otp', body.email]);
      } else {
        this.loginBtn = false;
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data?.detail });
        this.utilsService.loadSpinner(false);
      }
    }).catch((error: any) => {
      this.utilsService.loadSpinner(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
    });
  }
}
