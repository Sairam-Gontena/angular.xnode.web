import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { SignUpRoutingModule } from './signup-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    SignUpRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    DividerModule,
    GoogleSigninButtonModule,
    SocialLoginModule,
    DialogModule
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('429647457919-gov40lg2ok2gglfro438vchcrqqa0kqe.apps.googleusercontent.com'),
        },
      ],
    } as SocialAuthServiceConfig,
  }]
})
export class SignUpModule { }
