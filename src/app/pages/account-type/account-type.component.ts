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
        { name: 'Tech & Software',value:'TECH_SFT' },
        { name: 'E-Commerce',value:'ECOM' },
        { name: 'Healthcare',value:'HEALTHCARE' },
        { name: 'Services',value:'SERVICES' },
        { name: 'Hospitality & Tourism',value:'HSPTLY_TRSM' },
        { name: 'Media & Entertainment',value:'MEDIA_ENTRNMNT' },
        { name: 'Education',value:'EDCTN' },
        { name: 'Non-Profit & Community',value:'NONPRFT_CMNTY' },
        { name: 'Agriculture & Farming',value:'AGR_FRMNG' },
        { name: 'Manufacturing',value:'MANUFACTURING' },
        { name: 'Creative',value:'CREATIVE' },
        { name: 'Transport & Logistics',value:'TRNSPRT_LOGSTCS' },
        { name: 'Environmental & Energy',value:'ENV_ENRGY' },
        { name: 'Freelancers & Solopreneurs',value:'FREELANCE_SOLO' },
        { name: 'Others',value:'OTHERS' },
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
      let route = `sign-up?account=${form.value.accountFor}&businesstype=${form.value.businessType.value}`;
      this.router.navigateByUrl(route);
    } else {
        form.markAllAsTouched();
    }
  }
}
