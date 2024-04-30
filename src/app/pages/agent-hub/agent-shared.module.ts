import { NgModule } from "@angular/core";
import { AgentHeaderComponent } from "./component/agent-header/agent-header.component";
import { SharedModule } from "src/app/shared/shared.module";
import { SharedComponentModule } from "src/app/shared/shared-component.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        AgentHeaderComponent
    ],
    imports: [CommonModule,
        SharedModule,
        SharedComponentModule],
    exports: [AgentHeaderComponent,
        CommonModule,
        SharedModule,
        SharedComponentModule],
    providers: []
})
export class AgentSharedModule { }