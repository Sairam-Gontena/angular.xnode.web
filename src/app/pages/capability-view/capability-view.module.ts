import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedComponentModule } from 'src/app/shared/shared-component.module';
import { TabViewModule } from 'primeng/tabview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CapabilityViewComponent } from './capability-view.component';
import { CapabilityViewRoutingModule } from './capability-view-routing.module';

@NgModule({
    declarations: [
        CapabilityViewComponent
    ],
    imports: [
        CommonModule,
        CapabilityViewRoutingModule,
        TabMenuModule,

        TabViewModule,
        MultiSelectModule,
        DropdownModule,
        SplitButtonModule,
        ButtonModule,
        SharedModule,
        SharedComponentModule
    ]
})
export class CapabilityViewModule { }
