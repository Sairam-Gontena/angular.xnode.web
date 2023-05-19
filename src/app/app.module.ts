import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ERGeneratorModule } from './er-generator/generator.module';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppSideMenuComponent } from './components/app-side-menu/app-side-menu.component';
import { PrimeModulesModule } from './prime-modules/prime-modules.module';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { TableModule } from 'primeng/table';
// import { SignUpComponent } from './pages/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppSideMenuComponent,
    DynamicTableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    KtdGridModule,
    PrimeModulesModule,
    ReactiveFormsModule,
    // CUSTOM
    ERGeneratorModule,
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
