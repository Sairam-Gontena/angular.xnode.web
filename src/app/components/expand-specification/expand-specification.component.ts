import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UtilsService } from 'src/app/components/services/utils.service';


declare const SwaggerUIBundle: any;

@Component({
  selector: 'xnode-expand-specification',
  templateUrl: './expand-specification.component.html',
  styleUrls: ['./expand-specification.component.scss']
})
export class ExpandSpecificationComponent {
  @Input() dataToExpand: any;
  @Output() dataFlowEmitter = new EventEmitter<any>();

  iframeSrc: SafeResourceUrl = '';
  targetUrl: string = environment.naviAppUrl;

  constructor(private domSanitizer: DomSanitizer, private utils: UtilsService) {
  }


  ngOnInit() {
    const record_id = localStorage.getItem('record_id');
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let user_id = JSON.parse(userData).id;
    if (record_id) {
      this.targetUrl = environment.designStudioAppUrl + "?email=" + email + "&id=" + record_id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + true + '&isVerified=true' + "&userId=" + user_id;
    }
    this.makeTrustedUrl();
  }

  ngAfterViewInit() {
    this.fetchOpenAPISpec()
  }

  expandComponent(val: any): void {
    setTimeout(() => {
      this.utils.passSelectedSectionIndex(this.dataToExpand.item);
    }, 500)
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

  makeTrustedUrl(): void {
    this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }
}
