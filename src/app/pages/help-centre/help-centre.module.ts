import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpCentreComponent } from './help-centre.component';
import { HelpCentreRoutingModule } from './help-centre-routing.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [
        HelpCentreComponent,
    ],
    imports: [
        CommonModule,
        ButtonModule,
        HelpCentreRoutingModule,
    ]
})
export class HelpCentreModule { }
