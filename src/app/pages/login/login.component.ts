import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    });
    // Store the three users in localStorage
    localStorage.setItem('user1', JSON.stringify({ email: 'demo@xnode.ai', password: 'demo@123' }));
    localStorage.setItem('user2', JSON.stringify({ email: 'test@xnode.ai', password: 'test@123' }));
    localStorage.setItem('user3', JSON.stringify({ email: 'dev@xnode.ai', password: 'dev@123' }));

  }

  ngOnInit(): void {
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

  get login() { return this.loginForm.controls; }

  onClickLogin() {
    this.submitted = true;
    localStorage.setItem('currentUser', JSON.stringify(this.loginForm.value));
    // Stop here if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    const enteredEmail = this.loginForm.value.email;
    const enteredPassword = this.loginForm.value.password;

    const storedUsers = [
      JSON.parse(localStorage.getItem('user1') || '{}'),
      JSON.parse(localStorage.getItem('user2') || '{}'),
      JSON.parse(localStorage.getItem('user3') || '{}')
    ];

    const matchedUser = storedUsers.find(user => user.email === enteredEmail && user.password === enteredPassword);

    if (matchedUser) {
      this.router.navigate(['/my-templates']);
    } else {

    }

  }
}
