import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'xnode-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  @Input() visible = false;
  @Output() dataActionEvent = new EventEmitter<any>();

  constructor(public utils: UtilsService) {

  }

  ngOnInit(): void {
  }

  handleDataAndAction(value: any) {
    this.dataActionEvent.emit({ reportBug: true })
  }
  closePopup() {
    this.utils.showFeedbackPopupByType('');
  }
}
