import { Component } from '@angular/core';

@Component({
  selector: 'xnode-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent {

  showContent: boolean = true;
  showContent1: boolean = false;
  showContent2: boolean = false;
  showContent3: boolean = false;

  toggleContent() {
    this.showContent1 = true;
    this.showContent2 = false;
    this.showContent3 = false;
    this.showContent = false;
  }
}
