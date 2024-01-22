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
  @Input() selectedVersionOne:any;
  @Input() selectedVersionTwo:any;
  @Output() closeFullScreenView = new EventEmitter<any>();
  @Output() childLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  iframeSrc: SafeResourceUrl = '';
  targetUrl: string = environment.naviAppUrl;
  product: any;
  constructor(private domSanitizer: DomSanitizer,private storageService:LocalStorageService,private specService: SpecificationsService) {
  }

  ngOnInit() {
    this.product = this.storageService.getItem(StorageKeys.Product);
    const userData:any = this.storageService.getItem(StorageKeys.CurrentUser);
    this.targetUrl = environment.designStudioAppUrl + "?email=" + this.product.email + "&id=" + this.product.id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + true + '&isVerified=true' + "&userId=" + userData.user_id;
    this.makeTrustedUrl();
  }

  ngAfterViewInit(){
    if(this.dataToExpand.title=== 'OpenAPI Spec' || this.dataToExpand.title==='Open API Spec'){
      this.fetchSwagger();
    }
  }

  fetchSwagger(){
    if(this.diffViewEnabled){
      this.fetchOpenAPISpec('openapi-ui-spec-1',this.selectedVersionOne.id);
      this.fetchOpenAPISpec('openapi-ui-spec-2',this.selectedVersionTwo.id);
    }else{
      this.fetchOpenAPISpec('openapi-ui-spec',this.selectedVersionOne.id);
    }
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

}
