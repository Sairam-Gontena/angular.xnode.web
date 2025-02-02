import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/api/auth.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
@Component({
  selector: 'xnode-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitted: boolean = false;
  confirmPasswordValidator: boolean = false;
  errorMessage!: string;
  socialUser!: SocialUser;
  isLoggedin?: boolean;
  accountType: any;
  businessType: any;
  visible: boolean = false;

  linkedInCredentials = {
    clientId: '867kfsdknrsm4q',
    redirectUrl: 'https://y8pud.codesandbox.io/linkedInLogin',
    scope: 'r_liteprofile%20r_emailaddress%20w_member_social', // To read basic user profile data and email
  };

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private socialAuthService: SocialAuthService,
    private route: ActivatedRoute,
    private authApiService: AuthApiService,
    private utilService: UtilsService,
    private auditUtil: AuditutilsService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.accountType = params.account;
      this.businessType = params.businesstype;
    });
    let currentDateTime = new Date().toJSON('yyyy/MM/dd HH:mm');
    this.signUpForm = this.formBuilder.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        account_type: this.accountType,
        business_type: this.businessType,
        user_status: 'active',
        created_on: currentDateTime,
        activate_on: currentDateTime,
        modified_on: currentDateTime,
      },
      {
        validator: ConfirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {
    localStorage.clear();
    this.signUpForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    this.socialAuthService.authState.subscribe((user: any) => {
      if (user) {
        this.socialUser = user;
        this.isLoggedin = user != null;
        this.loginWithGoogle(this.socialUser);
      }
    });
    let linkedInToken = this.route.snapshot.queryParams['code'];
  }

  loginWithGoogle(user: any): void {
    this.auditUtil.postAudit('SIGNUP_WITH_GOOGLE', 1, 'SUCCESS', 'user-audit');
  }

  ContinueWithLinkedIn() {
    const clientId = '868i5bmc7kt8yj'; //environment.xnodeAppUrl+'#/'
    const redirectUri = environment.xnodeAppUrl + 'ref=/sign-up'; //'https://www.linkedin.com/developers/tools/oauth/redirect';
    const scope = 'r_liteprofile r_emailaddress';
    const authUrl = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=987654321&scope=${scope}`;
    window.location.href = authUrl;
    this.auditUtil.postAudit(
      'SIGNUP_WITH_LINDEDIN',
      1,
      'SUCCESS',
      'user-audit'
    );
  }

  get signUp() {
    return this.signUpForm.controls;
  }

  onClickSignUp() {
    if (this.signUpForm.valid) {
      this.visible = true;
    }
    this.submitted = true;
    let pswdValidator =
      this.signUpForm.get('confirmPassword')?.errors?.[
        'confirmPasswordValidator'
      ];
    if (pswdValidator) {
      this.confirmPasswordValidator = true;
      return;
    }
    if (this.signUpForm.invalid) {
      return;
    }
    this.authApiService
      .signup(this.signUpForm.value)
      .then((response: any) => {
        if (response?.data?.detail) {
          this.utilService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.detail,
            life: 3000,
          });
          this.auditUtil.postAudit(
            'SIGNUP_' + response?.data?.detail,
            1,
            'FAILURE',
            'user-audit'
          );
          return;
        }
        if (response.data.message == 'success') {
          this.visible = true;
          this.utilService.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail:
              'Congratulations, your account has been successfully created',
            life: 3000,
          });
          this.auditUtil.postAudit('USER_SIGNUP', 1, 'SUCCESS', 'user-audit');
        }
      })
      .catch((error: any) => {
        this.utilService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
        });
        this.auditUtil.postAudit(
          'USER_SIGNUP_' + error,
          1,
          'FAILURE',
          'user-audit'
        );
      });
  }

  cancel() {
    this.visible = false;
  }

  showPopup() {
    this.visible = true;
  }
  handlePopupEvent(visible: boolean) {
    this.visible = visible;
  }
}
