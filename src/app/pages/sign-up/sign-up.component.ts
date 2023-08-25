import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Emails } from 'src/app/utils/login-util';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'xnode-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitted: boolean = false;
  confirmPasswordValidator:boolean = false;
  errorMessage!: string;
  socialUser!: SocialUser;
  isLoggedin?: boolean;
  linkedInCredentials = {
    clientId: "867kfsdknrsm4q",
    redirectUrl: "https://y8pud.codesandbox.io/linkedInLogin",
    scope: "r_liteprofile%20r_emailaddress%20w_member_social" // To read basic user profile data and email
  };

  constructor(private formBuilder: FormBuilder, public router: Router, private socialAuthService: SocialAuthService, private route: ActivatedRoute) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]] ,
    },
    {
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    });
  }

  ngOnInit(): void {
    console.log(environment.xnodeAppUrl+'#/')
    localStorage.clear();
    this.signUpForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    this.socialAuthService.authState.subscribe((user) => {
      if(user){
        this.socialUser = user;
        this.isLoggedin = user != null;
        this.loginWithGoogle(this.socialUser)
      }
    });

    let linkedInToken = this.route.snapshot.queryParams["code"];
    console.log('linkedin token',linkedInToken)
    // this.authService.signInWithLinkedIn(linkedInToken).subscribe((res:any) => {
    //   localStorage.setItem('token', res.jwtToken);
    //   this.router.navigate(['/dashboard']);
    // }, (error:any) => {
    //   console.log(error)
    // });
  }

  loginWithGoogle(user:any): void {
    // this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
        console.log(user);
  }

  
  ContinueWithLinkedIn() { 
    const clientId = '868i5bmc7kt8yj'; //environment.xnodeAppUrl+'#/'
    const redirectUri =environment.xnodeAppUrl+'ref=/sign-up';//'https://www.linkedin.com/developers/tools/oauth/redirect';
    const scope = 'r_liteprofile r_emailaddress';
    const authUrl = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=987654321&scope=${scope}`;
    window.location.href = authUrl; 
  }

  get signUp() { return this.signUpForm.controls; }

  onClickSignUp() {
    this.submitted = true;
    let pswdValidator = this.signUpForm.get('confirmPassword')?.errors?.['confirmPasswordValidator'];
    if(pswdValidator || pswdValidator==undefined){
      this.confirmPasswordValidator=true;
      return;
    }
    if (this.signUpForm.invalid) {
      return;
    }
    const matchedUser = Emails.find(user => user.email === this.signUpForm.value.email && user.password === this.signUpForm.value.password);
    localStorage.setItem('currentUser', JSON.stringify(this.signUpForm.value));
    if (matchedUser) {
      this.router.navigate(['/workspace']);
    } else {
      this.errorMessage = 'Email and password do not match.';
    }
  }


}