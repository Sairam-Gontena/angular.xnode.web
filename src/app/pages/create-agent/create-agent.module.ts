import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { CreateAgentRoutingModule } from './create-agent-routing.module';
import { CreateAgentComponent } from './create-agent.component';
import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateAgentComponent],
  imports: [
    CommonModule,
    CreateAgentRoutingModule,
    TabMenuModule,
    ReactiveFormsModule,
    TabViewModule,
    MultiSelectModule,
    DropdownModule,
    SplitButtonModule,
    ButtonModule,
    SharedModule,
    SharedComponentModule,
  ],
})
export class CreateAgentModule {}
