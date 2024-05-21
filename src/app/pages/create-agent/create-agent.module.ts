import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { CreateAgentRoutingModule } from './create-agent-routing.module';
import { CreateAgentComponent } from './create-agent.component';
import { CreateConfigureAgentHeaderComponent } from './component/create-configure-agent-header/create-configure-agent-header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfigureAgentComponent } from './component/configure-agent/configure-agent.component';
import { AgentPromptModule } from '../agent-hub/module/agent-prompt/agent-prompt.module';
import { AgentCapabilityModule } from '../agent-hub/module/agent-capability/agent-capability.module';
import { AgentTopicModule } from '../agent-hub/module/agent-topic/agent-topic.module';
import { AgentToolsModule } from '../agent-hub/module/agent-tools/agent-tools.module';
import { AgentModelModule } from '../agent-hub/module/agent-model/agent-model.module';
import { AgentDetailsModule } from '../agent-hub/module/agent-details/agent-details.module';

@NgModule({
  declarations: [
    CreateAgentComponent,
    CreateConfigureAgentHeaderComponent,
    ConfigureAgentComponent
  ],
  imports: [
    CommonModule,
    CreateAgentRoutingModule,
    SharedComponentModule,
    SharedModule,
    AgentPromptModule,
    AgentCapabilityModule,
    AgentTopicModule,
    AgentToolsModule,
    AgentModelModule,
    AgentDetailsModule
  ],
})
export class CreateAgentModule { }
