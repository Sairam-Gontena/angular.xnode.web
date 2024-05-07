import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentCapabilityComponent } from './agent-capability.component';

const routes: Routes = [
    { path: '', component: AgentCapabilityComponent, data: { breadcrumb: 'Capability' } },

    {
        path: '', data: { breadcrumb: 'Capability' },
        children: [
            { path: 'topic/:id', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-topic/agent-topic.module').then(m => m.AgentTopicModule) },
            { path: 'prompt/:id', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-prompt/agent-prompt.module').then(m => m.AgentPromptModule) },
            { path: 'model/:id', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-model/agent-model.module').then(m => m.AgentModelModule) },
            { path: 'tool/:id', data: { breadcrumb: null }, loadChildren: () => import('./../../module/agent-tools/agent-tools.module').then(m => m.AgentToolsModule) },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgentCapabilityRoutingModule { }
