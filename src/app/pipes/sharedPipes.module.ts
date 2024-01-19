import { NgModule } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import { AccordionHighlightPipe } from './accordionhighlight.pipe';
import { CompleteTextHighlightPipe } from './completeTextHighlight.pipe';

@NgModule({
    declarations: [HighlightPipe, AccordionHighlightPipe, CompleteTextHighlightPipe],
    exports: [HighlightPipe, AccordionHighlightPipe, CompleteTextHighlightPipe],
})
export class SharedPipesModule { }
