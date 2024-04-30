import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { CreateAgentRoutingModule } from './create-agent-routing.module';
import { CreateAgentComponent } from './create-agent.component';
import { CreateConfigureAgentHeaderComponent } from './component/create-configure-agent-header/create-configure-agent-header.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CreateAgentComponent,
    CreateConfigureAgentHeaderComponent
  ],
  imports: [
    CommonModule,
    CreateAgentRoutingModule,
    SharedComponentModule,
    SharedModule
  ],
})
export class CreateAgentModule { }
