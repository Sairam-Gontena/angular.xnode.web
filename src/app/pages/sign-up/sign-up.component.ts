import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'xnode-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder, public router: Router) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    localStorage.clear();
  }

  get signUp() { return this.signUpForm.controls; }

  onClickSignUp() {
    this.submitted = true;
    localStorage.setItem('currentUser', JSON.stringify(this.signUpForm.value));
    // Stop here if the form is invalid
    if (this.signUpForm.invalid) {
      return;
    }
    this.router.navigate(['/workspace']);

  }
}
