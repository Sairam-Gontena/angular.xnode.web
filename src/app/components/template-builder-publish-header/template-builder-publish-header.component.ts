import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-template-builder-publish-header',
  templateUrl: './template-builder-publish-header.component.html',
  styleUrls: ['./template-builder-publish-header.component.scss']
})

export class TemplateBuilderPublishHeaderComponent implements OnInit {
  templates: any;
  selectedTemplate: string = 'FinBuddy';

  ngOnInit(): void {
    this.templates = [
      { label: 'FinBuddy' }
    ]
  };

}
