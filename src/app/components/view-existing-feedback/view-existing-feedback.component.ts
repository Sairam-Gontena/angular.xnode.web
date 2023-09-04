import { Component } from '@angular/core';

@Component({
  selector: 'xnode-view-existing-feedback',
  templateUrl: './view-existing-feedback.component.html',
  styleUrls: ['./view-existing-feedback.component.scss']
})
export class ViewExistingFeedbackComponent {
  visible = true;
  areaTypes: any[] = [{ label: 'Reported Bug', value: 'RP' }, { label: 'General Feedback', value: 'GF' }];
  selectedArea: any;
}
