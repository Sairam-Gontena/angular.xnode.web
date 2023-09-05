import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
@Component({
  selector: 'xnode-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  submitted: boolean = false;
  confirmPasswordValidator: boolean = false;
  errorMessage!: string;
  messages: any = [];
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, private utilsService: UtilsService) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.forgotPasswordForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get forgot() {
    return this.forgotPasswordForm.controls;
  }

  onClick() {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.apiService.postAuth('', 'mfa/forgotpassword?email=' + this.forgotPasswordForm.get('email')?.value).then((response: any) => {
      if (response?.status === 200) {
        if (response?.data?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
        } else {
          this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: response.data.Message });
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000)
        }
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
      }
    }).catch((error: any) => {
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
    });
  }

  onClickSignup() {
    this.router.navigate(['/'])
  }

  backToLogin() {
    this.router.navigate(['/'])
  }
}
