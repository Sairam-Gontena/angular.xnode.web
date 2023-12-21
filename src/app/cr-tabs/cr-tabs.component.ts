import { Component, Input, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
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
declare const SwaggerUIBundle: any;
import { delay, of } from 'rxjs';

@Component({
  selector: 'xnode-cr-tabs',
  templateUrl: './cr-tabs.component.html',
  styleUrls: ['./cr-tabs.component.scss'],
  providers: [DatePipe],
})
export class CrTabsComponent {
  @Input() usersList: any;
  @Input() activeIndex: any;
  @Input() swaggerData:any;
  filters: any;
  currentUser: any;
  crData: any;
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
  crActions: any;
  comments: string = 'test';
  paraViewSections = SECTION_VIEW_CONFIG.paraViewSections;
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;
  userRolesViewSections = SECTION_VIEW_CONFIG.userRoleSection;
  userPersonaViewSections = SECTION_VIEW_CONFIG.userPersonaSection;
  targetUrl: string = '';
  bpmnFrom: string ='SPEC';//;  'Comments'
  iframeSrc: SafeResourceUrl = '';
  @ViewChild('op') overlayPanel: OverlayPanel | any;
  showLimitReachedPopup: boolean = false;
  specVersion: any;
  constructor(
    private api: ApiService,
    private utilsService: UtilsService,
    private commentsService: CommentsService,
    private storageService: LocalStorageService,
    private specUtils: SpecUtilsService,
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private auditUtil: AuditutilsService,
    private notifyApi: NotifyApiService
  ) {
    this.specUtils.getMeCrList.subscribe((event: any) => {
      if (event) this.getCRList();
    });
    this.specUtils.getMeSpecVersion.subscribe((res) => {
      if (res) {
        this.specVersion = res;
        this.getCRList();
      }
    });
  }

  ngOnInit() {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.filters = [
      { title: 'Filters', code: 'F' },
      { title: 'All', code: 'A' },
      { title: 'None', code: 'N' },
    ];
    this.overlayPanel?.toggle(true);
    this.specUtils.getMeProductDropdownChange.subscribe((res) => {
      if (this.activeIndex) {
        this.getCRList();
      }
    });
    this.makeTrustedUrl();
  }

  makeTrustedUrl(): void {
    let target =localStorage.getItem('targetUrl');
    if(target){
      this.targetUrl = target;
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.targetUrl
      );
    }
  }

  checkParaViewSections(title: string,parentTitle?:string) {
    if(parentTitle=='Technical Specifications'){
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

  checkUserPersonaSections(title:string){
    return (
      this.userPersonaViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }


  fetchOpenSpecAPI(crId:any){
      const ui = SwaggerUIBundle({
        domNode: document.getElementById('openapi-ui-spec'+crId),
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

  getCRList() {
    let body: any = {
      productId: this.product?.id,
      // baseVersionId: this.specVersion.id
    }
    this.utilsService.loadSpinner(true);
    this.commentsService
      .getCrList(body)
      .then((res: any) => {
        if (res) {
          let data: any[] = res.data.map((item: any) => {
            return { ...item, checked: false };
          });
          this.crData = data;
          this.crList = Array.from({ length: this.crData.length }, () => []);
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

  onAccordionOpen(obj: any, index: number): void {
    this.getCRDetails(obj?.id, index);
  }

  getCRDetails(crId: any, index: number): void {
    this.utilsService.loadSpinner(true);
    this.api
      .getComments('cr-entity-mapping?crId=' + crId)
      .then((res: any) => {
        if (res) {
          this.crList[index] = res.data;
          this.crList.forEach((item:any)=>{
            item.forEach((subItem:any)=>{
              if(subItem.comment){
                if(subItem.comment.referenceContent.title==='OpenAPI Spec'){
                  of(([])).pipe(
                    delay(500)
                   ).subscribe((results) => {
                    this.fetchOpenSpecAPI(subItem.crId)
                  });
                }
              }else{
                if(subItem.task.referenceContent.title==='OpenAPI Spec'){
                  of(([])).pipe(
                    delay(500)
                   ).subscribe((results) => {
                    this.fetchOpenSpecAPI(subItem.crId)
                  });
                }
              }
            })

          })
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
      words = report?.firstName + report?.lastName;
    } else {
      words = report?.firstName + report?.lastName;
    }
    if (words?.length >= 2) {
      var firstLetterOfFirstWord = words[0][0].toUpperCase(); // Get the first letter of the first word
      var firstLetterOfSecondWord = words[1][0].toUpperCase(); // Get the first letter of the second word
      return firstLetterOfFirstWord + firstLetterOfSecondWord;
    }
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
      default:
        break;
    }
  }

  onClickAction(action: string) {
    if (action == 'Yes') {
      if (this.updateSpecBtnTriggered) {
        this.updateSpec();
      } else {
        this.approveRequest();
      }
    } else if (action == 'No') {
      this.header = '';
      this.content = '';
    }
    this.openConfirmationPopUp = false;
    this.updateSpecBtnTriggered = false;
  }

  updateSpec(): void {
    this.utilsService.loadSpinner(true);
    const cr_ids = this.checkedCrList.map((item: any) => item.id);
    this.api
      .postApi({ product_id: this.product?.id, cr_id: cr_ids }, 'specs/update')
      .then((res: any) => {
        if (res && res.status === 200) {
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
          this.specUtils._getLatestCrList(true);
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
      .post('email/notify', body)
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
    this.apiService
      .get('navi/total_apps_published/' + this.currentUser?.account_id)
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
    const body = {
      repoName: this.product.title,
      projectName: environment.projectName,
      email: this.currentUser.email,
      envName: environment.branchName,
      productId: this.product?.id,
    };
    this.apiService
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
            summary: 'ERROR',
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
      action: this.selectedStatus === 'NEEDS WORK' ? 'NEEDS_WORK' : this.selectedStatus,
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
          this.specUtils._getLatestCrList(true);
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
    // event.stopPropagation();
    this.checkedCrList = this.crData.filter((cr: any) => cr.checked);
  }

  onClickUpdateSpec(): void {
    this.updateSpecBtnTriggered = true;
    this.content = 'Are you sure, do you want to update spec?';
    this.header = 'Update Spec';
  }

  onClickViewChanges(data: any): void {
    this.specUtils._getSpecBasedOnVersionID(data);
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
    this.showNewCrPopup = true;
  }

  getMeActions(cr: any): void {
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
