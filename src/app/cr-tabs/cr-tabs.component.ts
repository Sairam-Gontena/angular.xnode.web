import { Component, Input, SimpleChange, ViewChild } from '@angular/core';
import { UtilsService } from '../components/services/utils.service';
import { CommentsService } from 'src/app/api/comments.service';
import { LocalStorageService } from '../components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { DatePipe } from '@angular/common';
import { SpecUtilsService } from '../components/services/spec-utils.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { SECTION_VIEW_CONFIG } from '../pages/specifications/section-view-config';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AuditutilsService } from '../api/auditutils.service';
import { NotifyApiService } from '../api/notify.service';
import { delay, of } from 'rxjs';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpecApiService } from '../api/spec-api.service';
import { NaviApiService } from '../api/navi-api.service';
import { SpecificationUtilsService } from '../pages/diff-viewer/specificationUtils.service';
declare const SwaggerUIBundle: any;

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'xnode-cr-tabs',
  templateUrl: './cr-tabs.component.html',
  styleUrls: ['./cr-tabs.component.scss'],
  providers: [DatePipe],
})
export class CrTabsComponent {
  @Input() activeIndex: any;
  @Input() swaggerData: any;
  @Input() crData: any;
  @Input() reveiwerList: any;
  @ViewChild('myCalendar') datePicker: any;
  @ViewChild('addUser') addUser: any;
  usersList: any;
  addReviewerForm: FormGroup;
  filters: any;
  selectedFilter: any;
  currentUser: any;
  showComment: boolean = false;
  header: string = '';
  content: string = '';
  openConfirmationPopUp: boolean = false;
  selectedCr: any;
  selectedStatus: string = '';
  listData: any = [];
  isOpen = true;
  checkedCrList: any = [];
  updateSpecBtnTriggered: boolean = false;
  product: any;
  crList: any = [];
  showNewCrPopup: boolean = false;
  usingFilter: boolean = false;
  crActions: any;
  comments: string = 'test';
  searchIconKeyword: string = '';
  selectedUsers: any = [];
  paraViewSections = SECTION_VIEW_CONFIG.paraViewSections;
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;
  userRolesViewSections = SECTION_VIEW_CONFIG.userRoleSection;
  userPersonaViewSections = SECTION_VIEW_CONFIG.userPersonaSection;
  targetUrl: string = '';
  crHeader: string = 'Add New CR';
  bpmnFrom: string = 'SPEC'; //;  'Comments'
  iframeSrc: SafeResourceUrl = '';
  searchUpdated: Subject<string> = new Subject<string>();
  @ViewChild('op') overlayPanel: OverlayPanel | any;
  showLimitReachedPopup: boolean = false;
  specVersion: any;
  crDataCopy: any;
  filter: any;
  sortColumn: string = 'dueDate';
  sortDirection: string = 'desc';
  filteredReveiwers: any = [];
  suggestions: any;
  priorityList: any = [
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' },
  ];
  showDropdown: boolean = false;
  selectedDateLabel: any;
  minDate: Date;
  dueDate: Date | undefined;
  crIds: any = [];
  reviewer: any;
  archiveCRPopup: boolean = false;
  unlinkCRPopup: boolean = false;

  constructor(
    private utilsService: UtilsService,
    private commentsService: CommentsService,
    private storageService: LocalStorageService,
    private specUtils: SpecUtilsService,
    private sanitizer: DomSanitizer,
    private auditUtil: AuditutilsService,
    private notifyApi: NotifyApiService,
    private fb: FormBuilder,
    private specService: SpecApiService,
    private naviApiService: NaviApiService,
    private specificationUtils: SpecificationUtilsService
  ) {
    this.minDate = new Date();
    this.addReviewerForm = this.fb.group({
      reviewersLOne: [''],
    });
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.specificationUtils.getMeCrList.subscribe((event: any) => {
      if (event) {
        this.crData = event;
        this.crActions = [];
        this.prepareDataToDisplay();
      }
    });
  }

  onSelectPriority(selectedPriority: any) {
    this.showDropdown = false;
    let body = {
      crIds: this.crIds,
      priority: selectedPriority.value,
    };
    this.updateCRActions(body);
  }
  closeDatePicker() {
    this.datePicker.overlayVisible = false;
  }
  closeAddUser() {
    if (this.addUser) {
      this.addUser.hide();
    }
  }

  emitData(event: any) {
    if (event) {
      this.getMeCrList();
    }
  }

  onDateSelect(event: any) {
    this.datePicker.overlayVisible = true;
    event.stopPropagation();
  }
  archiveCR() {
    let body = {
      crIds: this.crIds,
    };
    this.updateCRActions(body);
  }
  unlinkCRHeader() {
    let body = {
      crIds: this.crIds,
    };
    this.unLinkCR(body);
  }
  toggleDropdown() {
    this.showDropdown = true;
  }
  updateReviewer(event: any) {
    let body = {
      crIds: this.crIds,
      reviewers: this.getMeReviewerIds(),
    };
    this.updateCRActions(body);
    this.addUser.hide();
  }

  updateDueDate(event: any) {
    let body = {
      crIds: this.crIds,
      duedate: this.dueDate,
    };
    this.updateCRActions(body);
    this.datePicker.overlayVisible = false;
  }
  getMeReviewerIds() {
    return {
      reviewers: [
        {
          level: 'L1',
          users: this.addReviewerForm.value.reviewersLOne.map(
            (obj: any) => obj.user_id
          ),
        },
      ],
    };
  }
  ngOnInit() {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.usersList = this.reveiwerList;
    this.filters = [
      { title: 'All', code: 'ALL' },
      { title: 'Draft', code: 'DRAFT' },
      { title: 'Updated', code: 'UPDATED' },
      { title: 'Submitted', code: 'SUBMITTED' },
      { title: 'Approved', code: 'APPROVED' },
    ];
    this.makeTrustedUrl();
    this.searchUpdated.pipe(debounceTime(1000)).subscribe((search: any) => {
      this.filterListBySearch();
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.filter = '';
    if (changes['crData']?.currentValue) {
      this.crData = changes['crData']?.currentValue;
      this.prepareDataToDisplay();
    }
  }

  changeSearchIconColor(entity: any) {
    this.usingFilter = true;
    this.filter = entity;
  }

  filterListBySearch() {
    this.crData = this.crDataCopy;
    let searchKeywordLowercase = this.searchIconKeyword.toLowerCase();
    if (this.searchIconKeyword.length > 0) {
      this.crData = this.crData.filter(
        (item: any) =>
          item.reason.toLowerCase().includes(searchKeywordLowercase) ||
          item.crId.toLowerCase().includes(searchKeywordLowercase)
      );
    }
    if (this.selectedUsers.length > 0) {
      this.crData = this.crData.filter((item: any) =>
        this.selectedUsers.includes(item.author.userId)
      );
    }
  }

  filterListByUsersFilter() {
    this.crData = this.crDataCopy;
    if (this.selectedUsers.length > 0) {
      this.crData = this.crData.filter((item: any) =>
        this.selectedUsers.includes(item.author.userId)
      );
    }
    if (this.searchIconKeyword.length) {
      this.crData = this.crData.filter(
        (item: any) =>
          item.reason
            .toLowerCase()
            .includes(this.searchIconKeyword.toLowerCase()) ||
          item.crId.toLowerCase().includes(this.searchIconKeyword.toLowerCase())
      );
    }
  }

  searchConversation() {
    this.searchUpdated.next(this.searchIconKeyword);
  }

  makeTrustedUrl(): void {
    let target = localStorage.getItem('targetUrl');
    if (target) {
      this.targetUrl = target;
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.targetUrl
      );
    }
  }

  checkParaViewSections(title: string, parentTitle?: string) {
    if (parentTitle == 'Technical Specifications') {
      return;
    }
    return (
      this.paraViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  checkListViewSections(title: string) {
    return (
      this.listViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  checkUserRoleSections(title: string) {
    return (
      this.userRolesViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  checkUserPersonaSections(title: string) {
    return (
      this.userPersonaViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  filterListData() {
    let filterWithStatus = true;
    this.selectedFilter.code == 'ALL'
      ? this.getMeCrList()
      : this.getMeCrList(filterWithStatus);
  }

  fetchOpenSpecAPI(id: any) {
    const ui = SwaggerUIBundle({
      domNode: document.getElementById('openapi-ui-spec' + id),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      spec: this.swaggerData,
      docExpansion: 'none',
      operationsSorter: 'alpha',
    });
  }

  sortCrList(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    // Perform the sorting logic on your crData array
    this.crData.sort((a: any, b: any) => {
      const aValue = new Date(a.duedate).getTime();
      const bValue = new Date(b.duedate).getTime();

      if (this.sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }

  prepareDataToDisplay(): void {
    let data: any[] = this.crData?.map((item: any) => {
      const currentDate = new Date().toISOString().split('T')[0];
      const isOldDate = new Date(item.duedate).getFullYear() === 1970;
      const updatedItem = {
        ...item,
        checked: false,
        duedate: isOldDate ? currentDate : item.duedate,
      };

      return updatedItem;
    });
    this.crData = data;
    this.crDataCopy = this.crData;
    this.crList = Array.from({ length: this.crData.length }, () => []);
  }

  onAccordionOpen(obj: any, index: number): void {
    this.getCRDetails(obj?.id, index);
  }
  updateCRActions(body: any) {
    this.utilsService.loadSpinner(true);

    this.commentsService
      .updateCRActions(body)
      .then((response: any) => {
        if (response && response.status === 201) {
          this.utilsService.loadToaster({
            severity: 'success',
            summary: 'CR Updated successfully',
            detail: response?.data?.common?.status,
          });
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.common?.status,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((err: any) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err.message,
        });
        this.utilsService.loadSpinner(false);
      });
  }
  getCRDetails(crId: any, index: number): void {
    this.utilsService.loadSpinner(true);
    this.commentsService
      .getLinkedCrs({ crId: crId })
      .then((res: any) => {
        if (res) {
          this.crList[index] = res.data;
          this.crList.forEach((item: any) => {
            item.forEach((subItem: any) => {
              if (subItem.comment) {
                if (subItem.comment.referenceContent.title === 'OpenAPI Spec') {
                  of([])
                    .pipe(delay(1000))
                    .subscribe((results) => {
                      this.fetchOpenSpecAPI(subItem.id);
                    });
                }
              } else {
                if (subItem.task.referenceContent.title === 'OpenAPI Spec') {
                  of([])
                    .pipe(delay(1000))
                    .subscribe((results) => {
                      this.fetchOpenSpecAPI(subItem.id);
                    });
                }
              }
            });
          });
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res?.data?.common?.status,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((err: any) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.utilsService.loadSpinner(false);
      });
    this.showComment = false;
  }

  toggleShowComment() {
    this.showComment = !this.showComment;
  }

  getMeUserAvatar(report?: any) {
    let words: any;
    if (report) {
      words =
        report?.firstName?.charAt(0).toUpperCase() +
        report?.lastName?.charAt(0).toUpperCase();
    } else {
      words = null;
    }
    return words;
  }

  updateSelectedCr(obj: any) {
    this.selectedCr = obj;
  }

  updateChagneRequestStatus(value: string) {
    this.selectedStatus = value;
    switch (value) {
      case 'ARCHIVE':
        this.header = 'Archive CR';
        this.content = 'Are you sure you want to Archive this CR?';
        this.openConfirmationPopUp = true;
        break;
      case 'SUBMIT':
        this.header = 'Submit CR';
        this.content = 'Are you sure you want to Submit this CR?';
        this.openConfirmationPopUp = true;
        break;
      case 'REJECT':
      case 'NEEDS WORK':
        this.crData.forEach((element: any) => {
          if (element.id === this.selectedCr.id) {
            element.showComment = true;
          } else {
            element.showComment = false;
          }
        });
        break;
      case 'APPROVE':
        this.header = 'Approve CR';
        this.content = 'Are you sure you want to Approve this CR?';
        this.openConfirmationPopUp = true;
        break;
      case 'PUBLISH APP':
        this.header = 'Publish APP';
        this.content = 'Are you sure you want to Publish App?';
        this.openConfirmationPopUp = true;
        break;
      case 'UNLINK':
        this.header = 'Unlink CR';
        this.content = 'Are you sure you want to Unlink this CR?';
        this.openConfirmationPopUp = true;
        this.unlinkCRPopup = true;
        break;
      case 'EDIT':
        if (
          this.selectedCr?.status == 'DRAFT' ||
          this.selectedCr?.status == 'GENERATED'
        ) {
          this.showNewCrPopup = true;
          this.crHeader = 'Edit CR';
        }
        break;
      default:
        break;
    }
  }

  onClickAction(action: string) {
    if (action == 'Yes') {
      if (this.updateSpecBtnTriggered) {
        this.updateSpec();
      } else if (this.unlinkCRPopup) {
        this.unlinkCRHeader();
      } else {
        this.approveRequest();
      }
    } else if (action == 'No') {
      this.header = '';
      this.content = '';
    }
    this.openConfirmationPopUp = false;
    this.updateSpecBtnTriggered = false;
    this.unlinkCRPopup = false;
  }
  filteredReveiwer(event: AutoCompleteCompleteEvent, reviewerType: string) {
    let filtered: any[] = [];
    let query = event.query;
    const selectedReviewers = Array.isArray(
      this.addReviewerForm.value.reviewersLOne
    )
      ? this.addReviewerForm.value.reviewersLOne.map((reviewer: any) =>
        reviewer.name.toLowerCase()
      )
      : [];
    filtered = this.reveiwerList.filter(
      (reviewer: any) =>
        reviewer.name.toLowerCase().indexOf(query.toLowerCase()) === 0 &&
        !selectedReviewers.includes(reviewer.name.toLowerCase())
    );
    this.filteredReveiwers = filtered;
  }
  search(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(
      (item) => event.query + '-' + item
    );
  }

  reduceToInitials(fullName: string): string {
    const nameParts = fullName.split(' ');
    const initials = nameParts.map((part) => part.charAt(0));
    const reducedName = initials.join('').toUpperCase();
    return reducedName;
  }

  updateSpec(): void {
    this.utilsService.loadSpinner(true);
    const cr_ids = this.checkedCrList.map((item: any) => item.id);
    this.naviApiService
      .updateSpec({ product_id: this.product?.id, cr_id: cr_ids })
      .then((res: any) => {
        if (res && res.status === 200) {
          this.crData.map((item: any) => item.checked === false);
          this.checkedCrList = [];
          if (typeof res.data !== 'string') {
            this.utilsService.loadToaster({
              severity: 'success',
              summary: 'SUCCESS',
              detail:
                'The spec has been updated to the new version successfully',
            });
          } else {
            this.utilsService.loadToaster({
              severity: 'error',
              summary: 'ERROR',
              detail: res?.data,
            });
          }
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res?.data?.detail,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((err: any) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.utilsService.loadSpinner(false);
      });
  }
  unLinkCR(body: any): void {
    this.commentsService
      .unLinkCr(body)
      .then((response: any) => {
        if (response) {
          this.utilsService.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: 'CR has been successfully UnLinked',
          });
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.common?.status,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((err) => {
        this.utilsService.toggleTaskAssign(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  sendEmailNotificationToTheUser(): void {
    const body = {
      to: [this.currentUser?.email],
      cc: ['beta@xnode.ai'],
      bcc: ['dev.xnode@salientminds.com'],
      emailTemplateCode: 'PUBLISH_APP_LIMIT_EXCEEDED',
      params: {
        username:
          this.currentUser?.first_name + ' ' + this.currentUser?.last_name,
      },
    };
    this.notifyApi
      .emailNotify(body)
      .then((res: any) => {
        if (res && res?.data?.detail) {
          let user_audit_body = {
            method: 'POST',
            url: res?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'SEND_EMAIL_NOTIFICATION_TO_USER_NOTIFICATION_PANEL',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product.id
          );
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res.data.detail,
          });
        }
      })
      .catch((err: any) => {
        let user_audit_body = {
          method: 'POST',
          url: err?.request?.responseURL,
          payload: body,
        };
        this.auditUtil.postAudit(
          'SEND_EMAIL_NOTIFICATION_TO_USER_NOTIFICATION_PANEL',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.product.id
        );
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  getMeTotalAppsPublishedCount(): void {
    this.naviApiService
      .getTotalPublishedApps(this.currentUser?.account_id)
      .then((res: any) => {
        if (res && res.status === 200) {
          const restriction_max_value = localStorage.getItem(
            'restriction_max_value'
          );
          if (restriction_max_value) {
            if (res.data.total_apps_published >= restriction_max_value) {
              this.showLimitReachedPopup = true;
              this.sendEmailNotificationToTheUser();
            } else {
              this.publishApp();
            }
          }
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_ME_TOTAL_APPS_PUBLISHED_COUNT_NOTIFICATION_PANEL',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product.id
          );
        } else {
          let user_audit_body = {
            method: 'GET',
            url: res?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_ME_TOTAL_APPS_PUBLISHED_COUNT_NOTIFICATION_PANEL',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product.id
          );
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res.data.detail,
            life: 3000,
          });
        }
      })
      .catch((err: any) => {
        let user_audit_body = {
          method: 'GET',
          url: err?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_ME_TOTAL_APPS_PUBLISHED_COUNT_NOTIFICATION_PANEL',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.product.id
        );
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
          life: 3000,
        });
      });
  }

  publishApp(): void {
    const product_uuid = this.product.overview.filter((obj: any) => obj.title === 'product_uuid')[0].content
    const body = {
      repoName: this.product.title,
      productUuid: product_uuid,
      projectName: environment.projectName,
      email: this.currentUser.email,
      crId: this.selectedCr.id,
    };
    this.commentsService
      .publishApp(body)
      .then((response: any) => {
        if (response) {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'PUBLISH_APP_HEADER',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product.id
          );
          this.utilsService.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail:
              'Your app publishing process started. You will get the notifications',
            life: 3000,
          });
        } else {
          let user_audit_body = {
            method: 'POST',
            url: response?.request?.responseURL,
            payload: body,
          };
          this.auditUtil.postAudit(
            'PUBLISH_APP_HEADER',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser.email,
            this.product.id
          );
          this.utilsService.loadToaster({
            severity: 'error',
            summary: response.status,
            detail: 'Network Error',
            life: 3000,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error) => {
        let user_audit_body = {
          method: 'POST',
          url: error?.request?.responseURL,
          payload: body,
        };
        this.auditUtil.postAudit(
          'PUBLISH_APP_HEADER',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser.email,
          this.product.id
        );
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error,
          life: 3000,
        });
        this.utilsService.loadSpinner(false);
      });
  }

  approveRequest(): void {
    this.utilsService.loadSpinner(true);
    if (this.selectedStatus === 'PUBLISH APP') {
      this.getMeTotalAppsPublishedCount();
      return;
    }
    const body = {
      entityId: this.selectedCr.id,
      action:
        this.selectedStatus === 'NEEDS WORK'
          ? 'NEEDS_WORK'
          : this.selectedStatus,
      userId: this.currentUser.user_id,
      comments: this.selectedCr.comments,
    };
    this.utilsService.loadSpinner(true);
    this.commentsService
      .performCrActions(body)
      .then((response: any) => {
        if (response?.data?.common?.status !== 'fail') {
          this.showComment = false;
          this.utilsService.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail:
              'CR has been' + ' ' + this.selectedStatus === 'ARCHIVE'
                ? 'ARCHIVED'
                : this.selectedStatus === 'SUBMIT'
                  ? 'SUBMITTED'
                  : this.selectedStatus === 'REJECT'
                    ? 'REJECTED'
                    : this.selectedStatus === 'APPROVE'
                      ? 'APPROVED'
                      : '' + ' ' + 'successfully',
          });
          this.getMeCrList();
          this.crData.forEach((ele: any) => {
            ele.showComment = false;
          });
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.common?.status,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((err) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  getMeCrList(filterWithStatus?: boolean) {
    let body: any;
    body = { productId: this.product?.id };
    if (filterWithStatus) {
      body = { productId: this.product?.id, status: this.selectedFilter.code };
    }
    this.utilsService.loadSpinner(true);
    this.commentsService
      .getCrList(body)
      .then((res: any) => {
        if (res && res.data) {
          // this.specUtils._openCommentsPanel(true);
          // this.specUtils._loadActiveTab(1);
          this.specUtils._getMeUpdatedCrs(res.data.data);
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res?.data?.common?.status,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((err: any) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.utilsService.loadSpinner(false);
      });
  }

  updateCommentsInfo(crInfo: any) {
    this.selectedCr['comments'] = crInfo.message;
    switch (this.selectedStatus) {
      case 'REJECT':
        this.header = 'Reject CR';
        this.content = 'Are you sure you want to Reject this CR?';
        break;
      case 'NEEDS WORK':
        this.header = 'Needs Work';
        this.content = 'Are you sure you want to  Reject this CR?';
        break;
      default:
        break;
    }
    this.openConfirmationPopUp = true;
  }

  onCheckCheckbox(event: any): void {
    this.checkedCrList = this.crData.filter((cr: any) => cr.checked);
    this.crIds = this.checkedCrList.map((cr: any) => cr.id);
  }

  onClickUpdateSpec(): void {
    this.updateSpecBtnTriggered = true;
    this.content = 'Are you sure, do you want to update spec?';
    this.header = 'Update Spec';
  }

  onClickViewChanges(data: any): void {
    this.getMeSpecInfo(data);
  }

  getMeSpecInfo(body?: any) {
    this.utilsService.loadSpinner(true);
    this.specService
      .getSpec({ productId: body.productId, versionId: body.versionId })
      .then((response) => {
        if (
          response.status === 200 &&
          response.data &&
          response.data.length > 0
        ) {
          this.specUtils._getLatestSpecVersions({
            versions: body.versions,
            specData: response.data,
            productId: body.productId,
            versionId: body.versionId,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((error) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
        this.utilsService.loadSpinner(false);
      });
  }

  checktableJsonSection(title: string): boolean {
    return (
      title === 'Business Rules' ||
      title === 'Functional Dependencies' ||
      title === 'Data Dictionary' ||
      title === 'User Interfaces' ||
      title === 'Annexures'
    );
  }

  createNewCr(): void {
    this.crHeader = 'Add New CR';
    this.showNewCrPopup = true;
  }

  getMeActions(cr: any): void {
    this.crActions = [];
    this.utilsService.loadSpinner(true);
    const body = {
      entityId: cr.id,
      userId: this.currentUser?.user_id,
    };
    this.selectedCr = cr;
    this.commentsService
      .getCrActions(body)
      .then((res: any) => {
        if (res) {
          this.crActions = res?.data;
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res.data.description,
          });
        }
        this.utilsService.loadSpinner(false);
      })
      .catch((err) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }
}
