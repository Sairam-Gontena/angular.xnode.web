import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'xnode-create-configure-agent-header',
  templateUrl: './create-configure-agent-header.component.html',
  styleUrls: ['./create-configure-agent-header.component.scss']
})
export class CreateConfigureAgentHeaderComponent {
  @Input() createConfigureHeaderData: any;
  @Output() headerClickHandler: EventEmitter<any> = new EventEmitter<any>();
  @Input() manualConfiguration: boolean = false;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.headerData?.currentValue) {
    }
  }

  //create and configure event
  createConfigureEvent(eventType: string) {
    let eventDetail: any = { eventType: eventType, eventData: "" };
    this.headerClickHandler.emit(eventDetail);
  }

}
