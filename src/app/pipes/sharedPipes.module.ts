import { NgModule } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import { AccordionHighlightPipe } from './accordionhighlight.pipe';

@NgModule({
    declarations: [HighlightPipe, AccordionHighlightPipe],
    exports: [HighlightPipe, AccordionHighlightPipe],
})
export class SharedPipesModule { }
