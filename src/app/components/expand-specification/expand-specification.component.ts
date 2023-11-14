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
  @Input() specExpanded?: boolean;
  @Output() closeFullScreenView = new EventEmitter<any>();

  iframeSrc: SafeResourceUrl = '';
  targetUrl: string = environment.naviAppUrl;
  product: any;
  constructor(private domSanitizer: DomSanitizer, private utils: UtilsService) {
  }


  ngOnInit() {
    const record_id = localStorage.getItem('record_id');
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product)
    }
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let user_id = JSON.parse(userData).id;
    if (record_id) {
      this.targetUrl = environment.designStudioAppUrl + "?email=" + this.product.email + "&id=" + record_id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + true + '&isVerified=true' + "&userId=" + user_id;
    }
    this.makeTrustedUrl();
    console.log(this.dataToExpand, '99999999999999')
  }

  ngAfterViewInit() {
    this.fetchOpenAPISpec()
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

  setColumnsToTheTable(data: any) {
    Object.entries(data.map((item: any) => {
      if (typeof (item) == 'string') { return }
    }))
    let cols;
    if (data[0]) {
      cols = Object.entries(data[0]).map(([field, value]) => ({ field, header: field, value }));
      return cols
    } else {
      cols = Object.entries(data).map(([field, value]) => ({ field, header: field, value }));
      return cols
    }
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
  isObject(value: any): boolean {
    return typeof value == 'object' ? true : false
  }

}
