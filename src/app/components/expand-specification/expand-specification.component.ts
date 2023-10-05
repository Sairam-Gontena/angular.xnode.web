import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

declare const SwaggerUIBundle: any;

@Component({
  selector: 'xnode-expand-specification',
  templateUrl: './expand-specification.component.html',
  styleUrls: ['./expand-specification.component.scss']
})
export class ExpandSpecificationComponent {
  @Input() dataToExpand: any;
  @Output() dataFlowEmitter = new EventEmitter<any>();

  ngOnInit() {
    console.log("inside expand component");
    console.log(this.dataToExpand)
  }

  ngAfterViewInit() {
    this.fetchOpenAPISpec()
  }

  expandComponent(val: any): void {
    console.log("inside the expanded ", val)
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
