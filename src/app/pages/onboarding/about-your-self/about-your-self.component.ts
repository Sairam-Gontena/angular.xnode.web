// import { Component } from '@angular/core';
// import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'xnode-about-your-self',
//   templateUrl: './about-your-self.component.html',
//   styleUrls: ['./about-your-self.component.scss']
// })
// export class AboutYourSelfComponent {
//   aboutYourForm!: FormGroup;
//   formBuilder: any;
//   constructor() { }
//   selectedCategory: any = null;
// form!: FormGroup;
//   categories: any[] = [
//     { name: 'For Personal', key: 'P' },
//     { name: 'For Commercial', key: 'C' },
//     { name: 'Others', key: 'O' }
//   ];

//   ngOnInit() {
//     this.selectedCategory = this.categories[0];
//     this.form = this.formBuilder.group({
//       category: ['', Validators.required],
//       additionalInfo: ['']
//     });
//     onSubmit(){
//       if (this.form.valid) {
//         // Process the form data here
//         console.log(this.form.value);
//       }
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xnode-about-your-self',
  templateUrl: './about-your-self.component.html',
  styleUrls: ['./about-your-self.component.scss']
})
export class AboutYourSelfComponent implements OnInit {
  form!: FormGroup;
  selectedCategory: any = null;
  isFormSubmitted = false;
  myForm!: FormGroup;
  aboutyourself!: FormGroup;
  categories: any[] = [
    { name: 'For Personal', key: 'P' },
    { name: 'For Commercial', key: 'C' },
    { name: 'Others', key: 'O' }
  ];
  submittedValue: undefined;

  constructor(private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      paymentOptions: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.selectedCategory = this.categories[0];
    this.form = this.formBuilder.group({
      category: ['', Validators.required],
      additionalInfo: ['']
    });
  }
  onClickWorkSpace() {
    this.isFormSubmitted = true;
    console.log('valid', this.myForm.valid);
    if (!this.myForm.valid) {
      console.log('Please provide all the required values!');
      this.submittedValue = undefined;
      return false;
    } else {
      console.log(this.myForm.value);
      this.submittedValue = this.categories.find(
        (rv) => rv.value === this.myForm.value['paymentOptions']
      );
      return true;
    }
  }

}
