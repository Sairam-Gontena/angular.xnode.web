import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonFormControls, JsonFormData } from './IAgentOverview';

interface ControlValidator {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
  nullValidator?: boolean;
}

interface FormControlConfig {
  name: string;
  value: any;
  validators: ControlValidator;
}

@Component({
  selector: 'xnode-agent-overview',
  templateUrl: './agent-overview.component.html',
  styleUrls: ['./agent-overview.component.scss']
})
export class AgentOverviewComponent {
  @Input() overviewInstructionDetail!: any;
  @Input() formStyle!: string;
  @Input() fieldClass!: string;
  @Input() labelClass!: string;
  @Input() inputClass!: string;

  overviewForm!: FormGroup;
  instructionForm!: FormGroup;
  overviewInstructionDetailObj: any;

  constructor(private formBuilder: FormBuilder) {
    this.overviewForm = this.formBuilder.group({
      name: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      parentTopic: [{ value: '', disabled: true }]
    });
    this.instructionForm = this.formBuilder.group({
      instruction: [''],
      guideline: [''],
      responsibilities: [''],
      context: [''],
      example: [''],
      keyValue: this.formBuilder.array([])
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.overviewInstructionDetail.currentValue) {
      this.overviewInstructionDetailObj = changes.overviewInstructionDetail.currentValue;
      this.overviewForm.patchValue({
        name: this.overviewInstructionDetailObj.overviewInstructionData.name,
        description: this.overviewInstructionDetailObj.overviewInstructionData.description,
        parentTopic: this.overviewInstructionDetailObj.overviewInstructionData.parent
      });
      this.instructionForm.patchValue({
        instruction: this.overviewInstructionDetailObj.overviewInstructionData.instruction,
        guideline: this.overviewInstructionDetailObj.overviewInstructionData.guideline,
        responsibilities: this.overviewInstructionDetailObj.overviewInstructionData.responsibility,
        context: this.overviewInstructionDetailObj.overviewInstructionData.context,
        example: JSON.stringify(this.overviewInstructionDetailObj.overviewInstructionData.example, undefined, 4)
      });
    }
  }

  // createForm(controls: JsonFormControls[]) {
  //   this.dynamicForm = this.fb.group({});
  //   for (const control of controls) {
  //     const validatorsToAdd = [];
  //     for (const [key, value] of Object.entries(control.validators)) {
  //       switch (key) {
  //         case 'min':
  //           validatorsToAdd.push(Validators.min(value));
  //           break;
  //         case 'max':
  //           validatorsToAdd.push(Validators.max(value));
  //           break;
  //         case 'required':
  //           if (value) {
  //             validatorsToAdd.push(Validators.required);
  //           }
  //           break;
  //         case 'requiredTrue':
  //           if (value) {
  //             validatorsToAdd.push(Validators.requiredTrue);
  //           }
  //           break;
  //         case 'email':
  //           if (value) {
  //             validatorsToAdd.push(Validators.email);
  //           }
  //           break;
  //         case 'minLength':
  //           validatorsToAdd.push(Validators.minLength(value));
  //           break;
  //         case 'maxLength':
  //           validatorsToAdd.push(Validators.maxLength(value));
  //           break;
  //         case 'pattern':
  //           validatorsToAdd.push(Validators.pattern(value));
  //           break;
  //         case 'nullValidator':
  //           if (value) {
  //             validatorsToAdd.push(Validators.nullValidator);
  //           }
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //     this.dynamicForm.addControl(
  //       control.name,
  //       this.fb.control(control.value, validatorsToAdd)
  //     );
  //   }
  // }

  onInstructionSubmit() {
    console.log(this.overviewForm.value);
    // console.log('Form valid: ', this.dynamicForm.valid);
    // console.log('Form values: ', this.dynamicForm.value);
  }
}