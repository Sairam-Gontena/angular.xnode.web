import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emails } from 'src/app/utils/login-util';
@Component({
  selector: 'xnode-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  messages: any = [
  ];

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
  }

  get login() { return this.loginForm.controls; }

  onClickLogin() {
    this.submitted = true;
    const matchedUser = Emails.find(user => user.email === this.loginForm.value.email && user.password === this.loginForm.value.password);
    // Stop here if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    if (matchedUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.loginForm.value));
      this.router.navigate(['/my-templates']);
    } else {
      this.messages = [
        { severity: 'error', summary: 'Error', detail: 'User not found' }
      ]
    }
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onClickLogin();
    }
  }
}
