import { NgModule, forwardRef } from '@angular/core';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicSubFormComponent  } from './dynamic-sub-form/dynamic-sub-form.component';
import { BuilderService } from './builder.service';
import { TextBoxComponent } from './text-box/text-box.component';
import { EmailInputComponent } from './email-input/email-input.component';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DynamicControlComponent } from './dynamic-control/dynamic-control.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignupDynamicFormComponent } from './signup-dynamic-form/signup-dynamic-form.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { DropdownComponent } from './dropdown/dropdown/dropdown.component';
import { CheckBoxComponent } from './check-box/check-box/check-box.component';
import { RadioButtonComponent } from './radio-button/radio-button/radio-button.component';
import { DatePickerComponent } from './date-picker/date-picker/date-picker.component';
import { TextAreaComponent } from './text-area/text-area/text-area.component';
import { DynamicButtonComponent } from './dynamic-buttons/dynamic-button/dynamic-button.component';
import { ChipsComponent } from './chips/chips/chips.component';
import { ChipsInputComponent } from './chips-input/chips-input.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, SharedModule],
  exports: [SignupDynamicFormComponent],
  providers: [BuilderService],
  declarations: [
    DynamicFormComponent,
    DynamicSubFormComponent,
    TextBoxComponent,
    EmailInputComponent,
    DynamicControlComponent,
    SignupDynamicFormComponent,
    NumberInputComponent,
    DropdownComponent,
    CheckBoxComponent,
    RadioButtonComponent,
    DatePickerComponent,
    TextAreaComponent,
    DynamicButtonComponent,
    ChipsComponent,
    ChipsInputComponent
  ],
})
export class FormBuilderModule {}
