import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emails } from 'src/app/utils/login-util';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'xnode-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitted: boolean = false;
  errorMessage!: string;
  firstname: any;
  lastname: any;
  email: any;
  password: any;

  constructor(private formBuilder: FormBuilder, public router: Router, private apiService: ApiService) {
    this.signUpForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    localStorage.clear();
    this.signUpForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get signUp() { return this.signUpForm.controls; }

  onClickSignUp() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    this.apiService.post(this.signUpForm.value, '/sign-up').then(response => {
      console.log(response);
      this.firstname = response.data[0].first_name;
      this.lastname = response.data[0].last_name;
      this.email = response.data[0].email;
      this.password = response.data[0].password;
      if (response) {
        localStorage.setItem('firstname', this.firstname);
        localStorage.setItem('lastname', this.lastname);
        localStorage.setItem('email', this.email);
        localStorage.setItem('password', this.password);
        localStorage.setItem('currentUser', JSON.stringify(this.signUpForm.value));
        this.router.navigate(['/workspace']);
      }
    })
      .catch(error => {
        console.error('Email and password do not match', error);
      });
  }
}


