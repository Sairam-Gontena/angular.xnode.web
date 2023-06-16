import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureRoutingModule } from './configure-routing.module';
import { ConfigureLayoutComponent } from 'src/app/components/configure-layout/configure-layout.component';
import { ConfigureComponent } from './configure.component';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';
@NgModule({
  declarations: [
    ConfigureLayoutComponent,
    ConfigureComponent,
  ],
  imports: [
    CommonModule,
    ConfigureRoutingModule,
    PrimeModulesModule
  ],
})

export class ConfigureModule { }
