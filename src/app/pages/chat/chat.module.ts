import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing.module';
import { PrimeModulesModule } from 'src/app/prime-modules/prime-modules.module';
import { ButtonModule } from 'primeng/button';
import { ChatComponent } from './chat.component';
import { AdviseTemplateComponent } from './advise-template/advise-template.component';


@NgModule({
  declarations: [
    ChatComponent,
    AdviseTemplateComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    PrimeModulesModule,
    ButtonModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class ChatModule { }
