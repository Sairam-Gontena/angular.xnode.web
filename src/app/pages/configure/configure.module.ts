import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureRoutingModule } from './configure-routing.module';
import { ConfigureComponent } from './configure.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
@NgModule({
  declarations: [
    ConfigureComponent,
  ],
  imports: [
    CommonModule,
    ConfigureRoutingModule,
    SharedModule,
    SharedComponentModule
  ],
})

export class ConfigureModule { }
