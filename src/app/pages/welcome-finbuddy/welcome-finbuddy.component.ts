import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-welcome-finbuddy',
  templateUrl: './welcome-finbuddy.component.html',
  styleUrls: ['./welcome-finbuddy.component.scss']
})
export class WelcomeFinbuddyComponent implements OnInit {
  signUpForm: FormGroup;
  submitted: boolean = false;
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

}
