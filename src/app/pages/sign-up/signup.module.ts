import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { SignUpRoutingModule } from './signup-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { PrimeModule } from 'src/app/prime-modules/prime.module';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import {
    SocialLoginModule,
    SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HttpClientModule } from '@angular/common/http';

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
        HttpClientModule
    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider('428503221481-aul4gv3ulnehnf46jovp602rc5j2hckv.apps.googleusercontent.com'),
                    },
                ],
            } as SocialAuthServiceConfig,
        },
    ],
})
export class SignUpModule { }
