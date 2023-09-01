import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpCentreComponent } from './help-centre.component';
import { HelpCentreRoutingModule } from './help-centre-routing.module';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
@NgModule({
    declarations: [
        HelpCentreComponent,
    ],
    imports: [
        CommonModule,
        ButtonModule,
        HelpCentreRoutingModule,
        AccordionModule,
    ]
})
export class HelpCentreModule { }
