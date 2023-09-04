import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpCentreRoutingModule } from './help-center-routing.module';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { HelpCenterComponent } from './help-center.component';

@NgModule({
    declarations: [
        HelpCenterComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        HelpCentreRoutingModule,
        AccordionModule,
    ]
})
export class HelpCentreModule { }
