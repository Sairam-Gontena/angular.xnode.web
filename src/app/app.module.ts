import { NgModule } from '@angular/core';
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
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    KtdGridModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    SharedComponentModule,
    NgIdleKeepaliveModule.forRoot(),
    SidebarModule,
    FormBuilderModule,
    NgxSpinnerModule,
    NgxCaptureModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
        allowedDomains: ['your-api-domain.com'],
        disallowedRoutes: ['your-api-domain.com/login'],
      },
    }),
  ],
  providers: [RefreshListService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
