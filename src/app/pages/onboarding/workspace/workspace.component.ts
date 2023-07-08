import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'xnode-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  submitted: boolean = false;
  workspaceForm!: FormGroup;
  teamOrCompany!: string;
  personal!: string;
  isFormSubmitted!: boolean;
  teamOrCompanySelected!: boolean;
  personalSelected!: boolean;
  isInvalid: boolean = false;
  isPlaceholderVisible: boolean = true;
  constructor(private formBuilder: FormBuilder, public router: Router) {
    this.workspaceForm = this.formBuilder.group({
      companyName: ['', Validators.required],
    });
  }
  get Form() { return this.workspaceForm.controls; }
  ngOnInit(): void {
  }
  onClickWorkSpace() {
    this.submitted = true;
    this.isFormSubmitted = true;
    if (!this.teamOrCompanySelected && !this.personalSelected) {
      this.isInvalid = true;
      return;
    }
    if (this.workspaceForm.invalid) {
      this.isInvalid = true;
      return;
    }
    this.isInvalid = false;
    this.router.navigate(['/brand-guideline']);
  }
  selectTeamOrCompany() {
    this.teamOrCompanySelected = true;
    this.personalSelected = false;
  }
  selectPersonal() {
    this.teamOrCompanySelected = false;
    this.personalSelected = true;
  }
  onInputFocus() {
    this.isPlaceholderVisible = false;
  }
  onInputBlur() {
    this.isPlaceholderVisible = false;
  }
}
