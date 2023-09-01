import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpCentreComponent } from './help-centre.component';

const routes: Routes = [
    {
        path: '',
        component: HelpCentreComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HelpCentreRoutingModule { }
