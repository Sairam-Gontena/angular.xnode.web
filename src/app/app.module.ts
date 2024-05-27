import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedComponentModule } from './shared/shared-component.module';
import { SharedModule } from './shared/shared.module';
import { SidebarModule } from 'primeng/sidebar';
import { RefreshListService } from './RefreshList.service';
import { FormBuilderModule } from './components/form-builder/form-builder.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxCaptureModule } from 'ngx-capture';
import { JwtModule } from '@auth0/angular-jwt';
import { NaviAppModule } from 'navi-web';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthApiService } from './api/auth.service';
import { appInitializer } from './utils/app.initializer';
import { JwtInterceptor } from './utils/jwt.interceptor';
import { ErrorInterceptor } from './utils/error.interceptor';
import { LocalStorageService } from './components/services/local-storage.service';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    NgIdleKeepaliveModule.forRoot(),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    KtdGridModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    SharedComponentModule,
    SidebarModule,
    FormBuilderModule,
    NgxSpinnerModule,
    NgxCaptureModule,
    NaviAppModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
        allowedDomains: ['your-api-domain.com'],
        disallowedRoutes: ['your-api-domain.com/login'],
      },
    }),
    // LibraryModule.forRoot(environment)
  ],
  providers: [RefreshListService, DatePipe,
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [LocalStorageService, AuthApiService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: 'environment', useValue: environment }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
