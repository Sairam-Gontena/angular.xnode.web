import { Component, OnInit, HostListener, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss']
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {

  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();

  templates: any;
  selectedTemplate = localStorage.getItem('app_name');
  highlightedIndex: string | null = null;
  templatesOptions: any;
  templateEvent: any;

  ngOnInit(): void {
    this.templates = [
      { label: localStorage.getItem('app_name') }
    ]

    this.templatesOptions = [
      { label: 'Preview' },
      { label: 'Publish' }
    ]
  };
  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
    this.iconClicked.emit(icon);
  }
  onDropdownOptionClick(event: any) {
    this.templateEvent = event.value.label;
    if (this.templateEvent == 'Preview') {
      window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
    }
  }
}
