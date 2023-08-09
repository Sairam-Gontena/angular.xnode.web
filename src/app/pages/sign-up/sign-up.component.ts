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
      localStorage.setItem('currentUser', JSON.stringify(this.signUpForm.value));
      if (response) {
        this.router.navigate(['/workspace']);
      }
    })
  }
}


