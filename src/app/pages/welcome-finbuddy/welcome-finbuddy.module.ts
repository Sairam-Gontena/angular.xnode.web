import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeFinbuddyRoutingModule } from './welcome-finbuddy-routing.module';
import { WelcomeFinbuddyComponent } from './welcome-finbuddy.component';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';

@NgModule({
  declarations: [
    WelcomeFinbuddyComponent,
  ],
  imports: [
    CommonModule,
    WelcomeFinbuddyRoutingModule,
    PrimeModulesModule
  ]
})
export class WelcomeFinbuddyModule { }
