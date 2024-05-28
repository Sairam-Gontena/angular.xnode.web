import { NgModule } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import { AccordionHighlightPipe } from './accordionhighlight.pipe';
import { CompleteTextHighlightPipe } from './completeTextHighlight.pipe';
import { UserInitialsPipe } from './user-initials.pipe';
import { TimeAgoPipe } from './timeAgo.pipe';
import { AcronymPipe } from './acronym.pipe';

@NgModule({
    declarations: [HighlightPipe, AccordionHighlightPipe, CompleteTextHighlightPipe, UserInitialsPipe, TimeAgoPipe, AcronymPipe],
    exports: [HighlightPipe, AccordionHighlightPipe, CompleteTextHighlightPipe, UserInitialsPipe, TimeAgoPipe, AcronymPipe],
})
export class SharedPipesModule { }
