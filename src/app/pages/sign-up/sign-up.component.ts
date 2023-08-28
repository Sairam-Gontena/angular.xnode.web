import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Emails } from 'src/app/utils/login-util';
import { ApiService } from 'src/app/api/api.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/components/services/utils.service';
import { CreateAccountPopupComponent } from '../create-account-popup/create-account-popup.component';
@Component({
  selector: 'xnode-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
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
    clientId: "867kfsdknrsm4q",
    redirectUrl: "https://y8pud.codesandbox.io/linkedInLogin",
    scope: "r_liteprofile%20r_emailaddress%20w_member_social" // To read basic user profile data and email
  };

  constructor(private formBuilder: FormBuilder, public router: Router, private socialAuthService: SocialAuthService, private route: ActivatedRoute, private apiService: ApiService, private utilService: UtilsService) {
    this.route.queryParams.subscribe((params: any) => {
      this.accountType = params.account;
      this.businessType = params.businesstype;
    });
    let currentDateTime = new Date().toJSON("yyyy/MM/dd HH:mm");
    this.signUpForm = this.formBuilder.group({
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
      modified_on: currentDateTime
    }, {
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    });
  }

  ngOnInit(): void {
    localStorage.clear();
    this.signUpForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.socialUser = user;
        this.isLoggedin = user != null;
        this.loginWithGoogle(this.socialUser)
      }
    });
    let linkedInToken = this.route.snapshot.queryParams["code"];
  }

  loginWithGoogle(user: any): void {
  }


  ContinueWithLinkedIn() {
    const clientId = '868i5bmc7kt8yj'; //environment.xnodeAppUrl+'#/'
    const redirectUri = environment.xnodeAppUrl + 'ref=/sign-up';//'https://www.linkedin.com/developers/tools/oauth/redirect';
    const scope = 'r_liteprofile r_emailaddress';
    const authUrl = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=987654321&scope=${scope}`;
    window.location.href = authUrl;
  }

  get signUp() { return this.signUpForm.controls; }

  onClickSignUp() {

    if (this.signUpForm.valid) {
      this.visible = true;
    }

    this.submitted = true;
    let pswdValidator = this.signUpForm.get('confirmPassword')?.errors?.['confirmPasswordValidator'];
    if (pswdValidator) {
      this.confirmPasswordValidator = true;
      return;
    }
    if (this.signUpForm.invalid) {
      return;
    }
    this.apiService.postAuth(this.signUpForm.value, 'auth/signup').then((response: any) => {
      if (response?.data?.detail) {
        this.utilService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response?.data?.detail, life: 3000 });
        return
      }
      if (response.data.message == "success") {
        this.visible = true;
        this.utilService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: "Congratulations, your account has been successfully created", life: 3000 });
      }
    }).catch((error: any) => {
      this.utilService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
    });
  }

  cancel() {
    this.visible = false;
    console.log(this.visible)
  }

  showPopup() {
    this.visible = true;
  }
  handlePopupEvent(visible: boolean) {
    this.visible = visible;
  }
}