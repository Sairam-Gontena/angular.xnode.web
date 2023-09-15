import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/api/auth.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
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
  email: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private authApiService: AuthApiService,
    private utilsService: UtilsService, private route: ActivatedRoute, private auditUtil: AuditutilsService) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.params['email'];
    this.forgotPasswordForm.get('email')?.setValue(this.email);
    this.forgotPasswordForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }
  get forgot() {
    return this.forgotPasswordForm.controls;
  }

  onClickSubmit() {
    this.utilsService.loadSpinner(true);
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.authApiService.postAuth('', 'mfa/forgotpassword?email=' + this.forgotPasswordForm.get('email')?.value).then((response: any) => {
      if (response?.status === 200) {
        if (response?.data?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
        } else {
          this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: response.data.Message });
          this.router.navigate(['/']);
        }
      } else {
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data.detail });
      }
      this.utilsService.loadSpinner(false);
    }).catch((error: any) => {
      this.utilsService.loadSpinner(false);
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
    });
  }

  backToLogin() {
    this.router.navigate(['/'])
  }
}
