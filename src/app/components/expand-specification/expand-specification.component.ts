import { Component, Input, Output, EventEmitter, AfterViewInit, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UtilsService } from 'src/app/components/services/utils.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from '../services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { SpecificationsService } from 'src/app/services/specifications.service';
declare const SwaggerUIBundle: any;
@Component({
  selector: 'xnode-expand-specification',
  templateUrl: './expand-specification.component.html',
  styleUrls: ['./expand-specification.component.scss']
})

export class ExpandSpecificationComponent {
  @Input() dataToExpand: any;
  @Input() specExpanded?: boolean;
  @Input() diffdataToExpand: any;
  @Input() diffViewEnabled: any;
  @Input() selectedVersionOne: any;
  @Input() selectedVersionTwo: any;
  @Input() selectedVersion: any;
  @Input() format: any;
  @Output() closeFullScreenView = new EventEmitter<any>();
  @Output() childLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  currentUser: any;
  iframeSrc: SafeResourceUrl = '';
  iframeSrc1: SafeResourceUrl | undefined;
  targetUrl: string = environment.naviAppUrl;
  product: any;
  firstIteration: boolean = true;
  constructor(private domSanitizer: DomSanitizer, private storageService: LocalStorageService, private specService: SpecificationsService, private utils: UtilsService) {
  }

  ngOnInit() {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    const token = this.storageService.getItem(StorageKeys.ACCESS_TOKEN);
    this.targetUrl = environment.designStudioAppUrl + "?email=" + this.product.email + "&id=" + this.product.id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + true + '&isVerified=true' + "&userId=" + this.currentUser.user_id;
    if (token) {
      this.targetUrl = this.targetUrl + '&token=' + token;
    }
    this.makeTrustedUrl();
  }

  ngAfterViewInit() {
    if (this.dataToExpand.title === 'OpenAPI Spec' || this.dataToExpand.title === 'Open API Spec') {
      this.fetchSwagger();
    }
  }

  enableSpinner() {
    this.utils.loadSpinner(true)
  }

  fetchSwagger() {
    if (this.diffViewEnabled) {
      this.fetchOpenAPISpec('openapi-ui-spec-1', this.selectedVersionOne.id);
      this.fetchOpenAPISpec('openapi-ui-spec-2', this.selectedVersionTwo.id);
    } else {
      this.fetchOpenAPISpec('openapi-ui-spec', this.selectedVersion.id);
    }
  }

  ngOnDestroy() {
    if (this.dataToExpand.title === 'OpenAPI Spec') {
      this.childLoaded.emit(true);
    }
  }

  async fetchOpenAPISpec(id: string, versionId: string) {
    const product: any = this.storageService.getItem(StorageKeys.Product)
    let swaggerUrl =
      environment.apiUrl + environment.endpoints.spec +
      'product-spec/openapi-spec/' +
      product.title +
      '/' +
      product?.id +
      '/' +
      versionId;
    const headers = {
      'Authorization': `Bearer ${this.storageService.getItem(StorageKeys.ACCESS_TOKEN)}`,
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': environment.apimSubscriptionKey
    };
    try {
      const response = await fetch(swaggerUrl, { headers });
      const spec = await response.json();

      // Do something with the spec, e.g., render it with SwaggerUIBundle
      const ui = SwaggerUIBundle({
        domNode: document.getElementById(id),
        layout: 'BaseLayout',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset,
        ],
        spec,
        docExpansion: 'none',
        operationsSorter: 'alpha',
      });

      this.utils.loadSpinner(false);
    } catch (error) {
      this.utils.loadSpinner(false);
      console.error('Error fetching OpenAPI spec:', error);
      // Handle error
    }
  }

  makeTrustedUrl(): void {
    this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }

  makeTrustedUrlForDiffView(versionId: any): any {
    if (this.firstIteration) {
      let Url = environment.designStudioAppUrl +
        '?email=' + encodeURIComponent(this.product?.email || '') +
        '&id=' + encodeURIComponent(this.product?.id || '') +
        '&version_id=' + encodeURIComponent(versionId) +
        '&targetUrl=' + encodeURIComponent(environment.xnodeAppUrl) +
        '&has_insights=' + true +
        '&isVerified=true' +
        '&userId=' + encodeURIComponent(this.currentUser.id || '');
      this.iframeSrc1 = this.domSanitizer.bypassSecurityTrustResourceUrl(Url);
      this.firstIteration = false;
      return this.iframeSrc1;
    }
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['format']?.currentValue)
      this.format = changes['format'].currentValue;
  }

}
