import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emails } from 'src/app/utils/login-util';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xnode-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {



  signUpForm: FormGroup;
  submitted: boolean = false;
  errorMessage!: string;
  ContinueWithGoogleSelected!: boolean;
  ContinueWithLinkedInSelected!: boolean;
  isFormSubmitted!: boolean;
  socialUser!: SocialUser;
  isLoggedin?: boolean;
  linkedInToken: any;
  user: SocialUser | null = null;
  constructor(private formBuilder: FormBuilder, public router: Router, private socialAuthService: SocialAuthService, private route: ActivatedRoute) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    localStorage.clear();
    this.signUpForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      console.log(this.socialUser);
      if (user) {
        this.user = user;
        this.storeUserDataInLocalStorage(user);


        this.router.navigate(['/workspace']);
      }
    });
    this.route.queryParams.subscribe(params => {
      const authorizationCode = params['code'];
      if (authorizationCode) {
        this.handleLinkedInCallback(authorizationCode);
      }
    });
  }


  get signUp() { return this.signUpForm.controls; }

  onClickSignUp() {
    this.submitted = true;
    if (this.ContinueWithGoogleSelected || this.ContinueWithLinkedInSelected) {
      this.router.navigate(['/workspace']);
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
  ContinueWithGoogle() {
    this.ContinueWithGoogleSelected = true;
    this.ContinueWithLinkedInSelected = false;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((userData: SocialUser) => {
        if (userData) {
          this.user = userData;
          this.storeUserDataInLocalStorage(userData);
          this.router.navigate(['/workspace']);

        }
      }

      )
  };

  ContinueWithLinkedIn() {
    this.ContinueWithGoogleSelected = false;
    this.ContinueWithLinkedInSelected = true;
    const clientId = '86t2uk8j3axxnd';
    const redirectUri = 'https://www.linkedin.com/developers/tools/oauth/redirect';
    const scope = 'r_liteprofile r_emailaddress';
    const authUrl = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=987654321&scope=${scope}`;
    window.location.href = authUrl;
    console.log(authUrl);


  }
  storeUserDataInLocalStorage(user: SocialUser) {
    localStorage.setItem('firstName', user.firstName);
    localStorage.setItem('lastName', user.lastName);
    localStorage.setItem('email', user.email);
    localStorage.setItem('user', JSON.stringify(user));

  }
  handleLinkedInCallback(authorizationCode: string) {
    const clientId = '86t2uk8j3axxnd';
    const redirectUri = 'https://www.linkedin.com/developers/tools/oauth/redirect';
    const tokenEndpoint = 'https://www.linkedin.com/oauth/v2/accessToken';
    const scope = 'r_liteprofile r_emailaddress';
    const authUrl = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=987654321&scope=${scope}`;
  }

}

