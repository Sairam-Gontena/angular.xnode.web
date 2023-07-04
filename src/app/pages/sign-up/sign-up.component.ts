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
  errorMessage!: string;

  constructor(private formBuilder: FormBuilder, public router: Router) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    // Store the three users in localStorage
    localStorage.setItem('user1', JSON.stringify({ email: 'demo@xnode.ai', password: 'demo@123' }));
    localStorage.setItem('user2', JSON.stringify({ email: 'test@xnode.ai', password: 'test@123' }));
    localStorage.setItem('user3', JSON.stringify({ email: 'dev@xnode.ai', password: 'dev@123' }));

  }

  ngOnInit(): void {
    // localStorage.clear();
    localStorage.removeItem('currentUser');
    const user1String = localStorage.getItem('user1');
    const user2String = localStorage.getItem('user2');
    const user3String = localStorage.getItem('user3');

    const storedUsers = [];

    if (user1String !== null) {
      const user1 = JSON.parse(user1String);
      storedUsers.push(user1);
    }

    if (user2String !== null) {
      const user2 = JSON.parse(user2String);
      storedUsers.push(user2);
    }

    if (user3String !== null) {
      const user3 = JSON.parse(user3String);
      storedUsers.push(user3);
    }

  }

  get signUp() { return this.signUpForm.controls; }

  onClickSignUp() {
    this.submitted = true;
    localStorage.setItem('currentUser', JSON.stringify(this.signUpForm.value));
    // Stop here if the form is invalid
    if (this.signUpForm.invalid) {
      return;
    }
    // this.router.navigate(['/workspace']);
    const enteredEmail = this.signUpForm.value.email;
    const enteredPassword = this.signUpForm.value.password;

    const storedUsers = [
      JSON.parse(localStorage.getItem('user1') || '{}'),
      JSON.parse(localStorage.getItem('user2') || '{}'),
      JSON.parse(localStorage.getItem('user3') || '{}')
    ];

    const matchedUser = storedUsers.find(user => user.email === enteredEmail && user.password === enteredPassword);

    if (matchedUser) {
      this.router.navigate(['/workspace']);
    } else {
      this.errorMessage = 'Email and password do not match.';
    }

  }
}
