import { NgModule } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import { AccordionHighlightPipe } from './accordionhighlight.pipe';
import { CompleteTextHighlightPipe } from './completeTextHighlight.pipe';
import { UserInitialsPipe } from './user-initials.pipe';
import { TimeAgoPipe } from './timeAgo.pipe';

@NgModule({
    declarations: [HighlightPipe, AccordionHighlightPipe, CompleteTextHighlightPipe, UserInitialsPipe, TimeAgoPipe],
    exports: [HighlightPipe, AccordionHighlightPipe, CompleteTextHighlightPipe, UserInitialsPipe, TimeAgoPipe],
})
export class SharedPipesModule { }
