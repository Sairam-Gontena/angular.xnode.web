import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonSpecTableComponent } from './common-spec-table.component';
import { HighlightPipe } from 'src/app/pipes/highlight.pipe';
import { CompleteTextHighlightPipe } from '../pipes/completeTextHighlight.pipe';
import { SharedComponentModule } from '../shared/shared-component.module';
import { SharedModule } from '../shared/shared.module';
@NgModule({
    declarations: [
        CommonSpecTableComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        SharedComponentModule
    ],
    providers: [HighlightPipe,CompleteTextHighlightPipe]
})
export class SpecificationsModule { }
