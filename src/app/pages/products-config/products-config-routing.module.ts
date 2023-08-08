import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErModellerModule } from '../er-modeller/er-modeller.module';
import { ProductsConfigComponent } from './products-config.component';
import { ErModellerComponent } from '../er-modeller/er-modeller.component';
import { BpmnDiagramComponent } from '../bpmn-diagram/bpmn-diagram.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsConfigComponent,
    children: [
      {
        path: "workflow/overview",
        component: BpmnDiagramComponent,
      },
      {
        path: 'data-modal/overview',
        component: ErModellerComponent,
      },
    ]

  }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProductsConfigRoutingModule { }
