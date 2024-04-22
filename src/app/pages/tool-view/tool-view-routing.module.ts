import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolViewComponent } from './tool-view.component';

const routes: Routes = [
    {
        path: '',
        component: ToolViewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ToolViewRoutingModule { }