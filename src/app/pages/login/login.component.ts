import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
  errorMessage!: string;

  messages: any = [
  ];

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // rememberMe: [true]
      rememberMe: new FormControl<string | null>(null)
    });
  }

  ngOnInit(): void {

    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get login() { return this.loginForm.controls; }

  onClickLogin() {
    this.submitted = true;
    console.log(this.loginForm)
    const matchedUser = Emails.find(user => user.email === this.loginForm.value.email && user.password === this.loginForm.value.password);
    // Stop here if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    localStorage.setItem('currentUser', JSON.stringify(matchedUser));
    if (matchedUser && matchedUser.role === 'admin') {
      this.router.navigate(['/admin/user-invitation']);
    } else if (matchedUser && matchedUser.role !== 'admin') {
      this.router.navigate(['/my-products']);
    } else {
      this.messages = [
        { severity: 'error', summary: 'Error', detail: 'User not found' }
      ]
    }
   
  }



}
