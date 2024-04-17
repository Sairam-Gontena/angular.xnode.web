import { NgModule } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import { AccordionHighlightPipe } from './accordionhighlight.pipe';
import { CompleteTextHighlightPipe } from './completeTextHighlight.pipe';
import { UserInitialsPipe } from './user-initials.pipe';

@NgModule({
    declarations: [HighlightPipe, AccordionHighlightPipe, CompleteTextHighlightPipe, UserInitialsPipe],
    exports: [HighlightPipe, AccordionHighlightPipe, CompleteTextHighlightPipe, UserInitialsPipe],
})
export class SharedPipesModule { }
