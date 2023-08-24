import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators  } from '@angular/forms';

@Component({
  selector: 'xnode-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.scss']
})
export class AccountTypeComponent implements OnInit{
  businesstype:any;
  accountTypeForm!: FormGroup;

  constructor(private router:Router,private fb: FormBuilder){
      this.businesstype = [
        { name: 'Personal' },
        { name: 'Company' },
    ];
  }

  ngOnInit() {
    this.accountTypeForm = this.fb.group({
      accountFor: ['', Validators.required],
      businessType: ['', Validators.required]
    });
  }
 
  onSubmit(form:any){
    if (form.valid) {
      console.log(form.value);
    } else {
        form.markAllAsTouched(); // Mark controls as touched to trigger error messages
    }
  }
}
