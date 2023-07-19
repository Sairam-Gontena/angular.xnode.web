import { Component } from '@angular/core';

@Component({
  selector: 'xnode-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent {
  dashboard: any;
  layoutColumns: any;
  templates: any;
  selectedTemplate = localStorage.getItem("app_name");
  highlightedIndex: string | null = null;
  isOpen = false;

  ngOnInit(): void {
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ]
  }
}
