import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { OverlayPanel } from 'primeng/overlaypanel';
import { isArray } from 'lodash';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { SpecVersion } from 'src/models/spec-versions';
import { SpecificationUtilsService } from 'src/app/pages/diff-viewer/specificationUtils.service';
import { SECTION_VIEW_CONFIG } from 'src/app/pages/specifications/section-view-config';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { delay, of } from 'rxjs';

@Component({
  selector: 'xnode-diff-comp',
  templateUrl: './diff-comp.component.html',
  styleUrls: ['./diff-comp.component.scss'],
})
export class DiffCompComponent implements OnInit {
  product: any;
  @Input() type: string = '';
  @Input() selectedVersionTwo: any;
  @Input() contentObj: any;
  @Input() format: any = 'line-by-line';
  @Input() diffObj: any;
  @Input() onDiff: boolean = false;
  @Input() index: any;
  @Input() users: any = [];
  @Input() reveiwerList: any = [];
  @Input() specItemId: any;
  @Input() parentTitle: any;
  @Input() parentId?: string;
  @Input() keyword: any;
  @Output() expandComponent = new EventEmitter<{
    contentObj: any;
    onDiff: boolean;
    diffObj?: any;
  }>();
  selectedText:any;
  @Output() childLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('selectionText') selectionText: OverlayPanel | any;
  iframeSrc: SafeResourceUrl = '';
  iframeSrc1: SafeResourceUrl = '';
  targetUrl: any;
  currentUser: any;
  removeselectedContent:boolean=false;
  functionCalled: boolean = false;
  openOverlayPanel: boolean = false;
  ComponentsToExpand = [
    'Open API Spec',
    'Data Model',
    'Data Dictionary',
    'Usecases',
    'Workflows',
    'Dashboards',
    'User Interface Design',
    'Data Quality Checks',
    'Historical Data Load',
    'Glossary',
    'Version Control',
    'Stakeholder Approvals',
    'User Personas',
  ];
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;
  selectedWordIndices: any;

  constructor(
    private storageService: LocalStorageService,
    private specService: SpecificationsService,
    private specificationUtils: SpecificationUtilsService,
    private domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    const version: any = this.storageService.getItem(StorageKeys.SpecVersion);
    if (this.contentObj?.content_data_type === 'DASHBOARD') {
      this.targetUrl =
        environment.designStudioAppUrl +
        '?email=' +
        this.product?.email +
        '&id=' +
        this.product?.id +
        '&version_id=' +
        version?.id +
        '&targetUrl=' +
        environment.xnodeAppUrl +
        '&has_insights=' +
        true +
        '&isVerified=true' +
        '&userId=' +
        this.currentUser.id;
      this.makeTrustedUrl();
    }
    if (this.contentObj?.content_data_type === 'DATA_DICTIONARY') {
      this.stringifyDictionaryObject();
    }
  }

  stringifyDictionaryObject(){
    this.contentObj.content.forEach((item:any)=>{
      if('columns' in item){
        item.columns.forEach((subitem:any)=>{
          subitem.columnType = Object.entries(subitem.columnType).map(([key, val]) => `${key}: ${val}`).join(', ');
          subitem.validators = Object.entries(subitem.validators).map(([key, val]) => `${key}: ${val}`).join(', ');
        })
      }
      if('tables' in item){
        item.tables.forEach((subitem:any)=>{
            if('columns' in subitem){
              subitem.columns.forEach((element:any) => {
                element.columnType = Object.entries(element.columnType).map(([key, val]) => `${key}: ${val}`).join(', ');
                element.validators = Object.entries(element.validators).map(([key, val]) => `${key}: ${val}`).join(', ');
              });
            }
        })
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['diffObj']?.currentValue)
      this.diffObj = changes['diffObj'].currentValue;
    if (changes['format']?.currentValue)
      this.format = changes['format'].currentValue;
    if (
      changes['onDiff']?.currentValue == true ||
      changes['onDiff']?.currentValue == false
    ) {
      if (this.contentObj?.content_data_type === 'SWAGGER') {
        this.childLoaded.emit(true);
      }
    }
    if (this.selectedVersionTwo) {
      this.makeTrustedUrlForDiffView(this.selectedVersionTwo);
    }
  }

  getType(content: any): string {
    return Array.isArray(content) ? 'array' : typeof content;
  }

  getDiffObj(fromArray: any[], srcObj: any, isOnDiff: boolean = false) {
    if (!isOnDiff) return undefined;
    if (isArray(fromArray))
      for (const item of fromArray) {
        if (srcObj.id === item.id) {
          return item;
        }
      }
    return undefined;
  }

  getMeContentObj(item: any, contentObj: any) {
    if (item && typeof item !== 'string') {
      item['content_data_type'] = 'str';
      item['parent_data_type'] = 'list';
    }
    return item;
  }

  getMeBanner(event: any) {
    return (
      './assets/' + event?.title?.toLowerCase()?.replace(/ /g, '') + '.svg'
    );
  }

  onClickViewComments(specItem: any): void {
    const version: SpecVersion | undefined = this.storageService.getItem(
      StorageKeys.SpecVersion
    );
    if (version) {
      this.specService.getMeSpecLevelCommentsList({
        parentId: specItem.parentId,
      });
      this.specificationUtils.openConversationPanel({
        openConversationPanel: true,
        parentTabIndex: 0,
        childTabIndex: 0,
      });
    }
  }

  makeTrustedUrl(): void {
    this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.targetUrl
    );
    localStorage.setItem('targetUrl', this.targetUrl);
  }

  makeTrustedUrlForDiffView(versionId: any): void {
    let targetUrl =
      environment.designStudioAppUrl +
      '?email=' +
      this.product?.email +
      '&id=' +
      this.product?.id +
      '&version_id=' +
      versionId +
      '&targetUrl=' +
      environment.xnodeAppUrl +
      '&has_insights=' +
      true +
      '&isVerified=true' +
      '&userId=' +
      this.currentUser.id;
    this.iframeSrc1 =
      this.domSanitizer.bypassSecurityTrustResourceUrl(targetUrl);
  }

  isString(item: any): boolean {
    return typeof item === 'string';
  }

  onOverlayHide() {
    this.openOverlayPanel = false;
    of([])
      .pipe(delay(1000))
      .subscribe((results) => {
        if (this.selectionText.overlayVisible) {
        } else {
          this.checkOverlay();
        }
      });
  }
  checkOverlay() {
    if (this.openOverlayPanel == false) {
      this.deSelect();
      this.selectedText = '';
      this.selectedWordIndices = [];
      this.removeselectedContent = true;
    }
  }

  deSelect() {
    if (window.getSelection) {
      window.getSelection()?.empty();
      window.getSelection()?.removeAllRanges();
    }
  }

  async onselect(data:any){
    if(data){
      this.selectedText = data.content;
      await new Promise((resolve) => setTimeout(resolve, 500));
      await this.selectionText.toggle(data.event);
    }
  }

  emptySelectedContent() {
    this.selectedText = '';
    this.selectedWordIndices = [];
  }
}
