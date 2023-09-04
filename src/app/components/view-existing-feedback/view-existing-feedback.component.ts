import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'xnode-view-existing-feedback',
  templateUrl: './view-existing-feedback.component.html',
  styleUrls: ['./view-existing-feedback.component.scss']
})
export class ViewExistingFeedbackComponent {

  public getScreenWidth: any;
  public dialogWidth: string = '80vw';
  visible = true;
  areaTypes: any[] = [{ label: 'Reported Bug', value: 'RP' }, { label: 'General Feedback', value: 'GF' }];
  selectedArea: any;

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 780) {
      this.dialogWidth = '100vw';
    } else if (this.getScreenWidth > 780 && this.getScreenWidth < 980) {
      this.dialogWidth = '80vw';
    } else if (this.getScreenWidth > 980) {
      this.dialogWidth = '80vw';
    }
  }

  constructor() {
    this.onWindowResize();
  }
}
