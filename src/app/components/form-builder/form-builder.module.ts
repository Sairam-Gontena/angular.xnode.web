import { NgModule } from '@angular/core';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { BuilderService } from './builder.service';
import { TextBoxComponent } from './text-box/text-box.component';
import { EmailInputComponent } from './email-input/email-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DynamicControlComponent } from './dynamic-control/dynamic-control.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignupDynamicFormComponent } from './signup-dynamic-form/signup-dynamic-form.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, SharedModule],
  exports: [SignupDynamicFormComponent],
  providers: [BuilderService],
  declarations: [
    DynamicFormComponent,
    TextBoxComponent,
    EmailInputComponent,
    DynamicControlComponent,
    SignupDynamicFormComponent,
  ],
})
export class FormBuilderModule {}
