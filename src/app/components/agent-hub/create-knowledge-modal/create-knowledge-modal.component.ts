import { Component, Input, } from '@angular/core';
import { AgentHubService } from 'src/app/api/agent-hub.service';

// export enum selectedTypeEnum {
//   file = "file",
//   link = "link"
// }
@Component({
  selector: 'xnode-create-knowledge-modal',
  templateUrl: './create-knowledge-modal.component.html',
  styleUrls: ['./create-knowledge-modal.component.scss']
})
export class CreateKnowledgeModalComponent {
  // selectedTypeEnum = selectedTypeEnum

  // @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // selectedFiles: File[] = [];
  // typeSelected: selectedTypeEnum = selectedTypeEnum.file


  // Initialize form group
  // createAgentKnowledge!: FormGroup;

  // constructor(private formBuilder: FormBuilder) {
  //   this.createAgentKnowledge = this.formBuilder.group({
  //     files: [[], Validators.required],
  //     folderName: ['', Validators.required]
  //   });
  // }


  // // Method to submit form
  // submitForm() {
  //   console.log('Form Value', this.createAgentKnowledge.value);
  //   if (this.createAgentKnowledge.valid) {
  //     console.log('Form submitted successfully!', this.createAgentKnowledge.value);
  //   }
  // }

  // onFileSelected(event: any) {
  //   for (let i = 0; i < event.target.files.length; i++) {
  //     this.selectedFiles.push(event.target.files[i]);
  //   }
  // }

  // removeFile(index: number) {
  //   this.selectedFiles.splice(index, 1);
  // }


  // onSelectType(val: selectedTypeEnum) {
  //   this.typeSelected = val
  // }

  constructor(private agentHubService: AgentHubService) { }

  @Input() display: boolean = false;


  onClose() {
    this.agentHubService.closeImportFiltePopup()
  }
}
