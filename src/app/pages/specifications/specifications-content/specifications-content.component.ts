import { Component, Input, ViewChild, ElementRef, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UtilsService } from 'src/app/components/services/utils.service';
import { environment } from 'src/environments/environment';
import { DataService } from '../../er-modeller/service/data.service';
declare const SwaggerUIBundle: any;
@Component({
  selector: 'xnode-specifications-content',
  templateUrl: './specifications-content.component.html',
  styleUrls: ['./specifications-content.component.scss']
})

export class SpecificationsContentComponent implements OnInit {
  @Input() specData: any;
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  app_name: any;
  iframeSrc: SafeResourceUrl = '';
  dataModelIframeSrc: SafeResourceUrl = '';
  showMoreContent?: boolean = false;
  selectedSpecItem: any;
  specItemList: any = [];
  selectedSpecItemListTitles: any = [];
  selectedSectionIndex: any;
  specItemIndex: any;
  targetUrl: string = environment.naviAppUrl;
  dataModel: any;
  dataToExpand: any
  specExpanded: boolean = false;
  checked: boolean = false;
  bodyData: any[] = [];
  dataQualityData: any[] = [];
  userInterfaceheaders: string[] = [];

  constructor(private utils: UtilsService,
    private domSanitizer: DomSanitizer,
    private dataService: DataService,) {
    this.dataModel = this.dataService.data;
    this.utils.getMeSpecItem.subscribe((event: any) => {
      if (event) {
        event.forEach((element: any) => {
          if (this.specItemList.length === 0) {
            this.specItemList = element.section;
          } else {
            this.specItemList = this.specItemList.concat(element.section)
          }
        });
        this.specItemList.forEach((obj: any) => {
          if (obj.title === 'User Personas' || obj.title === 'Error Handling'
            || obj.title === 'Stakeholder Approvals' || obj.title === 'Version Control' || obj.title === 'Glossary'
            || obj.title === 'Historical Data Load') {
            obj.contentType = 'table'
          } else if (obj.title === 'User Interface Design') {
            obj.contentType = 'iframe'
          } else if (obj.title === 'Feature Descriptions' || obj.title === 'Usecases'
            || obj.title === 'Reporting Requirements' || obj.title === 'Technical Known Issues' || obj.title === 'Technical Known Issues'
            || obj.title === 'Technical Known Issues' || obj.title === 'Technical Assumptions'
            || obj.title === 'Functional Assumptions' || obj.title === 'Functional Known Issues' || obj.title === 'Integration Points'
          ) {
            obj.contentType = 'list'
          } else if (obj.title === 'Data Management Persistence') {
            obj.contentType = 'data-model';
            this.makeTrustDataModelUrl()
          } else if (obj.title === 'Workflows') {
            obj.contentType = 'x-flows';
          }
          else if (obj.title === 'Data Dictionary' || obj.title === 'User Interfaces' || obj.title === 'Data Quality Checks'
            || obj.title === 'Functional Known Issues' || obj.title === 'Technical Known Issues' || obj.title === 'Annexures' || obj.title === 'Functional Dependencies'
            || obj.title === 'Business Rules') {
            obj.contentType = 'json'
            if (obj.title === 'User Interfaces') {
              this.userInterfaceheaders = Object.keys(obj.content[0]);
              obj.content.map((item: any) => this.bodyData.push({ 'title': item.title, 'content': Object.values(item.content) }));
            }
            if (obj.title === 'Data Quality Checks') {
              obj.content.map((item: any) => {
                console.log(item)
                if (item.content[0]) {
                  this.dataQualityData.push({ 'header': item?.title, 'title': Object.keys(item.content[0]), 'content': Object.values(item.content[0]) })
                } else {
                  this.dataQualityData.push({ 'header': item?.title, 'title': Object.keys(item.content), 'content': Object.values(item.content) })
                }
              });
            }
          }
          else if (obj.title === 'Interface Requirements') {
            obj.contentType = 'header-list'
          } else if (obj.title === 'OpenAPI Spec') {
            obj.contentType = 'OpenAPI'
          } else {
            obj.contentType = 'paragraph'
          }
        })
      }
    })
    this.utils.getMeSpecItemIndex.subscribe((event: any) => {
      if (event) {
        this.specItemIndex = event;
      }
    })
    this.utils.getMeSectionIndex.subscribe((event: any) => {
      if (event) {
        this.scrollToItem(event.title)
      }
    })
  }

  checkedToggle(bool: boolean) {
    this.checked = bool;
  }

  isObject(value: any): boolean {
    return typeof value === 'object';
  }

  returnValues(obj: any) {
    return Object.values(obj)
  }

  ngAfterViewInit() {
    this.fetchOpenAPISpec()
  }

  ngOnInit(): void {
    const record_id = localStorage.getItem('record_id');
    this.app_name = localStorage.getItem('app_name');
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let user_id = JSON.parse(userData).id;
    if (record_id) {
      this.targetUrl = environment.designStudioAppUrl + "?email=" + email + "&id=" + record_id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + true + '&isVerified=true' + "&userId=" + user_id;
    }
    this.makeTrustedUrl();
  }

  isArray(item: any) {
    return Array.isArray(item?.content);
  }

  onClickSeeMore(item: any, i: any): void {
    this.selectedSectionIndex = i;
    this.showMoreContent = !this.showMoreContent;
    this.specItemList.forEach((obj: any) => {
      if (obj.title === item.title) {
        obj.collapsed = true;
      }
    })
  }

  scrollToItem(itemId: string) {
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getMeBanner(event: any) {
    return './assets/' + event.title.toLowerCase().replace(/ /g, '') + '.svg';
  }

  makeTrustedUrl(): void {
    this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }
  makeTrustDataModelUrl(): void {
    this.dataModelIframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl('https://dev-xnode.azurewebsites.net/#/configuration/data-model/overview')
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

  expandComponent(val: any): void {
    this.dataToExpand = val;
    if (val.dataModel || val.xflows || val.swagger) {
      this.specExpanded = true
    } else {
      this.specExpanded = false;
      setTimeout(() => {
        this.fetchOpenAPISpec()
      }, 100)
    }
  }


}


