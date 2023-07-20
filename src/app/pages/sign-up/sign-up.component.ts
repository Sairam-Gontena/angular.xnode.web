import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emails } from 'src/app/utils/login-util';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';

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
  constructor(private formBuilder: FormBuilder, public router: Router, private socialAuthService: SocialAuthService) {
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
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);


  }
  ContinueWithLinkedIn() {
    this.ContinueWithGoogleSelected = false;
    this.ContinueWithLinkedInSelected = true;

  }

}