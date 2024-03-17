import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { CreateAgentRoutingModule } from './create-agent-routing.module';
import { CreateAgentComponent } from './create-agent.component';

@NgModule({
  declarations: [CreateAgentComponent],
  imports: [
    CommonModule,
    CreateAgentRoutingModule,
    SharedModule,
    SharedComponentModule,
  ],
})
export class CreateAgentModule {}
