import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'xnode-about-your-self',
  templateUrl: './about-your-self.component.html',
  styleUrls: ['./about-your-self.component.scss']
})

export class AboutYourSelfComponent implements OnInit {
  aboutyourselfForm!: FormGroup;
  selectedCategory: any = null;
  submitted!: boolean;
  isPlaceholderVisible: boolean = true;
  errorMessage!: string;
  categories: any[] = [
    { name: 'For Personal', key: 'P' },
    { name: 'For Commercial', key: 'C' },
    { name: 'Others', key: 'O' }
  ];

  constructor(private formBuilder: FormBuilder, public router: Router) { }

  ngOnInit() {
    this.aboutyourselfForm = this.formBuilder.group({
      selectedCategory: ['', Validators.required],
      Additionalinfo: ['', Validators.required]
    });
  }

  get Form() { return this.aboutyourselfForm.controls; }

  onClickaboutYourSelf() {
    this.submitted = true;
    if (this.aboutyourselfForm.invalid) {
      return;
    }
    this.router.navigate(['/export-get-started']);
  }

  @HostListener('document:keydown', ['$event'])

  handleKeyDown(event: KeyboardEvent) {
    // Check if the Enter key was pressed
    if (event.key === 'Enter') {
      this.onClickaboutYourSelf();
    }
  }

  onInputFocus() {
    this.isPlaceholderVisible = false;
  }

}

