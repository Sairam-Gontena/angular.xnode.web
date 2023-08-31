import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'xnode-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent {
  @Input() Actions: any[] = [];
  @Input() Data: any;
  @Output() dataActionEvent = new EventEmitter<object>();
  ngOnInit() {
  }

  onClickAction(action: any): void {
    this.dataActionEvent.emit(action)
  }
}
