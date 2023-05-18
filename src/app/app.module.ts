import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ERGeneratorModule } from './er-generator/generator.module';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppSideMenuComponent } from './components/app-side-menu/app-side-menu.component';
import { AdditionalInfoComponent } from './components/additional-info/additional-info.component'
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@NgModule({
  declarations: [AppComponent, AppHeaderComponent, AppSideMenuComponent, AdditionalInfoComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    ButtonModule,
    ERGeneratorModule,
    DialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
