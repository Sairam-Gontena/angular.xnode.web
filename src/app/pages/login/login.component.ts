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
      email: ['',  [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      
    });
    
  }

  ngOnInit(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('form-data')
  }

  get login() { return this.loginForm.controls; }

  onClickLogin() {
    this.submitted = true;
    localStorage.setItem('form-data', JSON.stringify(this.loginForm.value));
    // Stop here if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.router.navigate(['/my-templates']);
  }
}
