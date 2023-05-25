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

  openaddtionalinfopopup: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    });
  }

  ngOnInit(): void {
    localStorage.removeItem('currentUser');

  }

  get signUp() { return this.signUpForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    localStorage.setItem('currentUser', String(true));
    this.router.navigate(['/template-builder']);
  }
  onClickSignUp() {
    this.openaddtionalinfopopup = true;

  }
}
