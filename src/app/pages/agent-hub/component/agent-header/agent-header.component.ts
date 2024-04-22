import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'xnode-agent-header',
  templateUrl: './agent-header.component.html',
  styleUrls: ['./agent-header.component.scss']
})
export class AgentHeaderComponent {
  @Input() headerData: any;
  @Output() headerClickHandler: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.headerData?.currentValue) {
      this.headerData = changes.headerData?.currentValue;
    }
  }

  //bread crumb event
  breadCrumbsHandler(event: any) {
    let eventTypeData: any = { eventType: "breadcrum", data: event };
    this.headerClickHandler.emit(eventTypeData);
  }

  //create agent event
  createAgentHandler() {
    let eventTypeData = { eventType: "createAgent" };
    this.headerClickHandler.emit(eventTypeData);
  }

}
