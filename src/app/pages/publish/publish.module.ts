import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { PublishComponent } from './publish.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { PublishRoutingModule } from './publish-routing.module';

@NgModule({
  declarations: [
    PublishComponent,
  ],
  imports: [
    CommonModule,
    PublishRoutingModule,
    AccordionModule,
    SharedModule,
    DropdownModule,
    ButtonModule
  ]
})
export class PublishModule { }
