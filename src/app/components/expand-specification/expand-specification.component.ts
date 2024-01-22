import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
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
  @Input() diffdataToExpand:any;
  @Input() diffViewEnabled:any;
  @Output() closeFullScreenView = new EventEmitter<any>();
  @Output() childLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  iframeSrc: SafeResourceUrl = '';
  targetUrl: string = environment.naviAppUrl;
  product: any;
  isSpecSideMenuOpened: boolean = false;
  isDockedNaviOpended: boolean = false;
  specRouteParams: any;
  versions: any;
  constructor(private domSanitizer: DomSanitizer, private utils: UtilsService,private storageService:LocalStorageService,private route: ActivatedRoute,private specService: SpecificationsService) {
  }

  async ngOnInit() {
    this.product = this.storageService.getItem(StorageKeys.Product);
    const userData:any = this.storageService.getItem(StorageKeys.CurrentUser);
    this.targetUrl = environment.designStudioAppUrl + "?email=" + this.product.email + "&id=" + this.product.id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + true + '&isVerified=true' + "&userId=" + userData.user_id;
    this.makeTrustedUrl();
    await this.getVersions();
    if(this.dataToExpand.title=== 'OpenAPI Spec' || this.dataToExpand.title==='Open API Spec'){
      this.fetchSwagger();
    }
  }

  fetchSwagger(){
    const specVersionOne: any = this.storageService.getItem(StorageKeys.SpecVersion);
    if(this.diffViewEnabled){
      const index = this.findIndex(specVersionOne);
      let selectedVersionTwo = this.versions[index === 0 ? index + 1 : index - 1];
      this.fetchOpenAPISpec('openapi-ui-spec-1',specVersionOne.id);
      this.fetchOpenAPISpec('openapi-ui-spec-2',selectedVersionTwo.id);
    }else{
      this.fetchOpenAPISpec('openapi-ui-spec',specVersionOne.id);
    }
  }

  getVersions(): Promise<void> {
    this.utils.loadSpinner(true);
    return new Promise<void>((resolve, reject) => {
      this.specService.getVersions(this.product.id, (data: any) => {
        let version = data.filter((obj: any) => { return obj.id === this.specRouteParams.versionId ? this.specRouteParams.versionId : this.specRouteParams.version_id })[0];
        this.specService.getMeSpecInfo({
          productId: this.product?.id,
          versionId: version ? version.id : data[0].id,
        });
        this.versions = data;
        this.storageService.saveItem(StorageKeys.SpecVersion, version ? version : data[0]);
        resolve();
      });
    });
  }

  findIndex(objectToFind: any): number {
    return this.versions.findIndex((obj: any) => obj.id === objectToFind.id);
  }

  ngOnDestroy(){
    if(this.dataToExpand.title === 'OpenAPI Spec'){
      this.childLoaded.emit(true);
    }
  }

  async fetchOpenAPISpec(id:any,versionId:string) {
    const record_id = localStorage.getItem('record_id');
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    const ui = SwaggerUIBundle({
      domNode: document.getElementById(id),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      url: environment.uigenApiUrl + 'openapi-spec/' + localStorage.getItem('app_name') + "/" + email + '/' + record_id + '/'+versionId,
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
