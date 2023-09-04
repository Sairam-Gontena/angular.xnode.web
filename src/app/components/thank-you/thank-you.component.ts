import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'xnode-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  // @Input() thanksDialog = false;
  @Input() thanksDialog: boolean = false;;
  @Output() dataActionEvent = new EventEmitter<any>();

  ngOnInit(): void {
  }
  handleDataAndAction(value: any) {
    this.thanksDialog = false;
    this.dataActionEvent.emit({ reportBug: true })

    console.log(value, "1111111111111")
  }
}
