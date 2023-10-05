import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

declare const SwaggerUIBundle: any;

@Component({
  selector: 'xnode-expand-specification',
  templateUrl: './expand-specification.component.html',
  styleUrls: ['./expand-specification.component.scss']
})
export class ExpandSpecificationComponent {
  @Input() sectionToExpand: any;
  @Output() dataFlowEmitter = new EventEmitter<any>();

  ngOnInit() {  }

  ngAfterViewInit() {
    this.fetchOpenAPISpec()
  }

  expandComponent(val: any): void {
    this.dataFlowEmitter.emit(val);
  }

  async fetchOpenAPISpec() {
    const record_id = localStorage.getItem('record_id');
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    const ui = SwaggerUIBundle({
      domNode: document.getElementById('openapi-ui-spec'),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      url: environment.uigenApiUrl + 'openapi-spec/' + localStorage.getItem('app_name') + "/" + email + '/' + record_id,
      docExpansion: 'none',
      operationsSorter: 'alpha'
    });
  }
}
