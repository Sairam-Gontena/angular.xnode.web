import { Component, OnInit , HostListener, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss']
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {
 
  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();

  templates: any;
  selectedTemplate: string = 'FinBuddy';
  
  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
  };
  emitIconClicked(icon: string) {
    this.iconClicked.emit(icon);
  }
  
}
