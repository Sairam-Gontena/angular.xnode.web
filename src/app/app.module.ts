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
import { ChatRoutingModule } from './pages/chat/chat-routing.module';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputRadioComponent } from './components/input-radio/input-radio.component';
import { InputCheckboxComponent } from './components/input-checkbox/input-checkbox.component';
import { InputTextareaComponent } from './components/input-textarea/input-textarea.component';
import { InputDropdownComponent } from './components/input-dropdown/input-dropdown.component';
import { InputFormComponent } from './components/input-form/input-form.component';


@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppSideMenuComponent,
    // InputTextComponent,
    // InputRadioComponent,
    // InputCheckboxComponent,
    // InputTextareaComponent,
    // InputDropdownComponent,
    // InputFormComponent,
    
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
    OnboardingRoutingModule,
    ChatRoutingModule,

  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
