import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    PrimeModulesModule
  ]
})

export class LandingPageModule { }
