import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureRoutingModule } from './configure-routing.module';
import { ConfigureComponent } from './configure.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ConfigureComponent,
  ],
  imports: [
    CommonModule,
    ConfigureRoutingModule,
    ButtonModule,
    DropdownModule,
    AccordionModule,
    SharedModule
  ],
})

export class ConfigureModule { }
