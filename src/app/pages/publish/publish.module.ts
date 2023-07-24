import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishComponent } from './publish.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PublishRoutingModule } from './publish-routing.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';

@NgModule({
  declarations: [
    PublishComponent,
  ],
  imports: [
    CommonModule,
    PublishRoutingModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class PublishModule { }
