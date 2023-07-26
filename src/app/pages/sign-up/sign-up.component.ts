import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Emails } from 'src/app/utils/login-util';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';

import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private formBuilder: FormBuilder, public router: Router, private socialAuthService: SocialAuthService, private route: ActivatedRoute, private http: HttpClient) {
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
    this.route.queryParams.subscribe(params => {
      const authorizationCode = params['code'];
      if (authorizationCode) {
        this.handleLinkedInCallback(authorizationCode)
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
    console.log(scope, 'text');

  }
  storeUserDataInLocalStorage(user: SocialUser) {
    localStorage.setItem('firstName', user.firstName);
    localStorage.setItem('lastName', user.lastName);
    localStorage.setItem('email', user.email);


  }
  handleLinkedInCallback(authorizationCode: string) {
    const clientId = '86t2uk8j3axxnd';
    const clientSecret = 'AHKFK2HntewxTukQ';
    const redirectUri = 'https://www.linkedin.com/developers/tools/oauth/redirect';
    const tokenEndpoint = 'https://www.linkedin.com/oauth/v2/accessToken';
    const scope = 'jyostnallu@gmail.com';
    const authUrl = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=987654321&scope=${scope}`;
    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('code', authorizationCode);
    params.set('client_id', clientId);
    params.set('client_secret', clientSecret);
    params.set('redirect_uri', redirectUri);
    params.set('scope', 'jyostnaallu@gmail.com');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    this.http.post(tokenEndpoint, params.toString(), httpOptions).subscribe(
      (response: any) => {
        const accessToken = response.access_token;
        localStorage.setItem('acessToken', accessToken)
        // Fetch user profile data using the access token
        const profileEndpoint = 'https://api.linkedin.com/v2/me';
        const profileHttpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + accessToken
          })
        };
        this.http.get(profileEndpoint, profileHttpOptions).subscribe(
          (profileResponse: any) => {
            // Log the user's profile data
            console.log('LinkedIn Profile Data:', profileResponse);

            // Save user's name and other information if needed
            const firstName = profileResponse.firstName.localized.en_US;
            const lastName = profileResponse.lastName.localized.en_US;

            // Fetch user's email using the access token
            const emailEndpoint = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
            this.http.get(emailEndpoint, profileHttpOptions).subscribe(
              (emailResponse: any) => {
                // Log the user's email
                console.log('LinkedIn Email:', emailResponse.elements[0]['handle~'].emailAddress);

                // Here, you can store the user's data in local storage or perform any other actions
                // For example, you can store the first name, last name, and email in local storage as you have done before.
                // localStorage.setItem('firstName', firstName);
                // localStorage.setItem('lastName', lastName);
                // localStorage.setItem('email', emailResponse.elements[0]['handle~'].emailAddress);

                // Finally, navigate to the workspace or perform other actions as needed.
                this.router.navigate(['/workspace']);
              },
              (error) => {
                console.error('Error fetching user email:', error);
              }
            );
          },



          (error) => {
            console.error('Error exchanging authorization code for access token:', error);
          }
        );
      })
  }

}

