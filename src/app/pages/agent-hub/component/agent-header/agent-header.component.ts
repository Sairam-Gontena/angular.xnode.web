import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'xnode-agent-header',
  templateUrl: './agent-header.component.html',
  styleUrls: ['./agent-header.component.scss']
})
export class AgentHeaderComponent {
  @Input() headerData: any;
  @Output() headerClickHandler: EventEmitter<any> = new EventEmitter<any>();
  actionButtonMethod = {
    'command': () => { this.actionButtonEvent.bind(this) }
  }

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.headerData?.currentValue) {
      this.headerData = changes?.headerData?.currentValue;
      if (this.headerData?.actionButtonOption?.length) {
        this.headerData.actionButtonOption.forEach((element: any) => {
          if (element?.command) {
            let eventTypeData = { eventType: element.eventType, label: element.label }
            element.command = () => { this.actionButtonEvent(eventTypeData) };
          }
        });
      }
    }
  }

  //bread crumb event
  breadCrumbsHandler(event: any) {
    let eventTypeData: any = { eventType: "breadcrum", eventData: event };
    this.headerClickHandler.emit(eventTypeData);
  }

  //create agent event
  createAgentHandler() {
    let eventTypeData = { eventType: "createAgent" };
    this.headerClickHandler.emit(eventTypeData);
  }

  //action button event
  actionButtonEvent(eventData: any): void {
    let eventTypeData = { eventType: "actionButton", eventData: eventData };
    this.headerClickHandler.emit(eventTypeData);
  }

}
