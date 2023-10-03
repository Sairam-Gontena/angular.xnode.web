import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErModellerRoutingModule } from './er-modeller-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataService } from './service/data.service';
import { JsPlumbService } from './service/jsPlumb.service';
import { UtilService } from './service/util.service';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { ErModellerComponent } from './er-modeller.component';


@NgModule({
  declarations: [
    ErModellerComponent
  ],
  imports: [
    CommonModule,
    ErModellerRoutingModule,
    SharedModule,
    SharedComponentModule,
  ],
  providers: [DataService, JsPlumbService, UtilService],
})
export class ErModellerModule { }
