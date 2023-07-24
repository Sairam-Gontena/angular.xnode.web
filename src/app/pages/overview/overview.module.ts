import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverViewRoutingModule } from './overview-routing.module';
import { OverViewComponent } from './overview.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';

@NgModule({
  declarations: [
    OverViewComponent,
  ],
  imports: [
    CommonModule,
    OverViewRoutingModule,
    FlexLayoutModule,
    SharedModule,
    SharedComponentModule
  ]
})
export class OverViewModule {

}
