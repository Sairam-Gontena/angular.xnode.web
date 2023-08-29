import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
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

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService,
    private utilsService: UtilsService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: new FormControl<string | null>(null)
    });
  }

  ngOnInit(): void {
    this.utilsService.loadSpinner(true);
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get login() { return this.loginForm.controls; }

  onClickLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.utilsService.loadSpinner(true);
    localStorage.setItem('currentUser', JSON.stringify(this.loginForm.value));
    let body = { ...this.loginForm.value };
    delete body.rememberMe;
    this.apiService.login(body, "auth/beta/login")
      .then((response: any) => {
        if (response?.status === 200 && !response?.data?.detail) {
          this.utilsService.loadLoginUser(body);
          this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: response.data?.Message });
          setTimeout(() => {
            this.router.navigate(['/verify-otp']);
          }, 1000);
        } else {
          this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: response.data?.detail });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error: any) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });
      });
  }
}
