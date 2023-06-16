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
  highlightedIndex: string | null = null;

  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
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
  openNewTab(): void {
    window.open('http://localhost:50718/', '_blank');
  }
}
