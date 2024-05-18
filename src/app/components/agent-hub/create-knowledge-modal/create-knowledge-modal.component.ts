import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export enum selectedTypeEnum {
  file = "file",
  link = "link"
}
@Component({
  selector: 'xnode-create-knowledge-modal',
  templateUrl: './create-knowledge-modal.component.html',
  styleUrls: ['./create-knowledge-modal.component.scss']
})
export class CreateKnowledgeModalComponent {
  selectedTypeEnum = selectedTypeEnum

  @Input() display: boolean = false;
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedFiles: File[] = [];
  typeSelected: selectedTypeEnum = selectedTypeEnum.file

  onClose() {
    this.displayChange.emit(false);
  }

  // Initialize form group
  createAgentKnowledge!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.createAgentKnowledge = this.formBuilder.group({
      files: [[], Validators.required],
      folderName: ['', Validators.required]
    });
  }


  // Method to submit form
  submitForm() {
    console.info('Form Value', this.createAgentKnowledge.value);
    if (this.createAgentKnowledge.valid) {
      console.info('Form submitted successfully!', this.createAgentKnowledge.value);
    }
  }

  onFileSelected(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.selectedFiles.push(event.target.files[i]);
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }


  onSelectType(val: selectedTypeEnum) {
    this.typeSelected = val
  }

  // fileBrowseHandler(event: any) {
  //   const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
  //   const files = (event.target as HTMLInputElement).files;
  //   if (files && files.length > 0) {
  //     for (let i = 0; i < files.length; i++) {
  //       if (files[i].size > maxSizeInBytes) {
  //         //   this.utils.loadToaster({
  //         //     severity: 'error',
  //         //     summary: 'ERROR',
  //         //     detail: 'File size should not exceed 5mb',
  //         //   });
  //         // } else {
  //         // this.prepareFilesList(event.target.files);
  //       }
  //     }
  //   }
  // }

  // prepareFilesList(files: Array<any>) {
  //   let item: any;
  //   // for (item of files) {
  //   //   this.files.push(item);
  //   // }
  //   // this.readFileContent(item);
  // }

  // private async readFileContent(file: File) {
  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     const headers = {
  //       'Content-Type': 'application/json',
  //     };
  //     // await this.fileUploadCall(formData, headers); // await here
  //   };

  //   reader.readAsArrayBuffer(file); // Move this line outside the onload function
  // }
}
