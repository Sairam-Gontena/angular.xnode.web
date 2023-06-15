import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import { AppComponent } from './app.component';
import { ERGeneratorModule } from './er-generator/generator.module';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppSideMenuComponent } from './components/app-side-menu/app-side-menu.component';
import { PrimeModulesModule } from './prime-modules/prime-modules.module';
import { OnboardingRoutingModule } from './pages/onboarding/onboarding-routing.module';
import { OverViewComponent } from './pages/over-view/over-view.component';
import { PageNotFoundComponent } from './src/app/pages/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppSideMenuComponent,
    OverViewComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    KtdGridModule,
    PrimeModulesModule,
    // CUSTOM
    ERGeneratorModule,
    OnboardingRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
