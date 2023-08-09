import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emails } from 'src/app/utils/login-util';
import { ApiService } from 'src/app/api/api.service';
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

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {

    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get login() { return this.loginForm.controls; }

  onClickLogin() {
    this.apiService.post(this.loginForm.value, '/login')
      .then(res => {
        const responseData = res.data;
        console.log(res.data)
        if (this.loginForm.invalid) {
          return;
        }
        if (responseData) {
          localStorage.setItem('currentUser', JSON.stringify(this.loginForm.value));
          this.router.navigate(['/my-products']);
        }
        else {
          this.messages = [
            { severity: 'error', summary: 'Error', detail: 'User not found' }
          ]
        }
      }
      )
  }
}