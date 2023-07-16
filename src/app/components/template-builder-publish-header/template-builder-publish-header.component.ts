import { Component, OnInit, HostListener, Input, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss']
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {

  @Output() iconClicked: EventEmitter<string> = new EventEmitter<string>();
  selectedOption: string = 'Preview';
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
      {
        label: 'Preview',
        command: () => {
          this.selectedOption = 'Preview';
        }
      },
      {
        label: 'Publish',
        command: () => {
          this.selectedOption = 'Publish';
        }
      },
    ];
  };
  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
    this.iconClicked.emit(icon);
  }

  onSelectOption(): void {
    if (this.selectedOption == 'Preview') {
      window.open(environment.designStudioUrl, '_blank');
    }
  }
}
