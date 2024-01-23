import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { isArray } from 'lodash';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { SpecVersion } from 'src/models/spec-versions';
import { SpecificationUtilsService } from 'src/app/pages/diff-viewer/specificationUtils.service';
import { SECTION_VIEW_CONFIG } from 'src/app/pages/specifications/section-view-config';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
declare const SwaggerUIBundle: any;

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
  @Output() expandComponent = new EventEmitter<any>();
  @Output() childLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  iframeSrc: SafeResourceUrl = '';
  iframeSrc1: SafeResourceUrl = '';
  targetUrl: any;
  currentUser: any;
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
  ];
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;

  constructor(
    private storageService: LocalStorageService,
    private specService: SpecificationsService,
    private specificationUtils: SpecificationUtilsService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    let version: any = this.storageService.getItem(StorageKeys.SpecVersion);
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
  }

  ngAfterViewInit() {
    if (this.contentObj?.content_data_type === 'SWAGGER') {
      this.childLoaded.emit(true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['diffObj']?.currentValue)
      this.diffObj = changes['diffObj'].currentValue;
    if (changes['format']?.currentValue)
      this.format = changes['format'].currentValue;

    if (this.selectedVersionTwo) {
      this.makeTrustedUrlForDiffView(this.selectedVersionTwo);
    }
  }

  getType(content: any): string {
    return Array.isArray(content) ? 'array' : typeof content;
  }

  getDiffObj(fromArray: any[], srcObj: any, isOnDiff: boolean = false) {
    // console.log('fromArray', fromArray);
    // console.log('srcObj', srcObj);

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
    // console.log('<>>>>>>>>>>>>>>>>>>', item);

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
}
