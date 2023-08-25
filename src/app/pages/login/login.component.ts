import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { Emails } from 'src/app/utils/login-util';
import { environment } from 'src/environments/environment';
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

  constructor(private formBuilder: FormBuilder, private router: Router , private apiService:ApiService,private utilsService: UtilsService) {
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
    // const matchedUser = Emails.find(user => user.email === this.loginForm.value.email && user.password === this.loginForm.value.password);
    // Stop here if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.apiService.login(this.loginForm.value,"/auth/login")
    .then((response :any )=> {
      if (response?.status === 200) {
       localStorage.setItem('currentUser', JSON.stringify(this.loginForm.value));
      this.utilsService.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: response.data.message});
      this.router.navigate(['/verification']);
      
      }
    })
    .catch((error:any) => {
      console.log(error)
      this.utilsService.loadToaster({ severity: 'error', summary: 'ERROR', detail: error });

    });
    
    // localStorage.setItem('currentUser', JSON.stringify(matchedUser));
    // if (matchedUser && matchedUser.role === 'admin') {
    //   this.router.navigate(['/admin/user-invitation']);
    // } else if (matchedUser && matchedUser.role !== 'admin') {
    //   this.router.navigate(['/my-products']);
    // } else {
    //   this.messages = [
    //     { severity: 'error', summary: 'Error', detail: 'User not found' }
    //   ]
    // }
   
  }



}
