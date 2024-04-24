import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapabilityViewComponent } from './capability-view.component';

const routes: Routes = [
    {
        path: '',
        component: CapabilityViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CapabilityViewRoutingModule { }