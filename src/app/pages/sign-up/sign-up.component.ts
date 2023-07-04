import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emails } from 'src/app/utils/login-util';

@Component({
  selector: 'xnode-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitted: boolean = false;
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, public router: Router) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['dev', Validators.required],
      lastName: ['user', Validators.required],
      email: ['admin@xnode.ai', [Validators.required, Validators.email]],
      password: ['admin@123', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('currentUser');
  }

  get signUp() { return this.signUpForm.controls; }

  onClickSignUp() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    const matchedUser = Emails.find(user => user.email === this.signUpForm.value.email && user.password === this.signUpForm.value.password);
    localStorage.setItem('currentUser', JSON.stringify(this.signUpForm.value));
    if (matchedUser) {
      this.router.navigate(['/workspace']);
    } else {
      this.errorMessage = 'Email and password do not match.';
    }
  }
}
