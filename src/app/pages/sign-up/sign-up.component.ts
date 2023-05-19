import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xnode-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {


  signUpForm: FormGroup;
  submitted: boolean = false;
  router: any;
  signupcomponent!: SignUpComponent;
  visible: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    });
  }
  ngOnInit(): void {

  }
  get signUp() { return this.signUpForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
  }
  onClickSignUp() {
    this.visible = true;

  }
}
