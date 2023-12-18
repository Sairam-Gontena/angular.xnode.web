import { Component, Input, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UtilsService } from '../components/services/utils.service';
import { CommentsService } from 'src/app/api/comments.service';
import { LocalStorageService } from '../components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { DatePipe } from '@angular/common';
import { SpecUtilsService } from '../components/services/spec-utils.service';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'xnode-cr-tabs',
  templateUrl: './cr-tabs.component.html',
  styleUrls: ['./cr-tabs.component.scss'],
  providers: [DatePipe],
})
export class CrTabsComponent {
  @Input() usersList: any;
  @Input() activeIndex: any;
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
  @ViewChild('op') overlayPanel: OverlayPanel | any;

  constructor(
    private api: ApiService,
    private utilsService: UtilsService,
    private commentsService: CommentsService,
    private storageService: LocalStorageService,
    private specUtils: SpecUtilsService
  ) {
    this.specUtils.getMeCrList.subscribe((event: any) => {
      if (event) this.getCRList();
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
  }

  getCRList() {
    const prodId = localStorage.getItem('record_id');
    this.utilsService.loadSpinner(true);
    this.api
      .getComments('change-request?productId=' + prodId)
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
        break;
      case 'SUBMIT':
        this.header = 'Submit CR';
        this.content = 'Are you sure you want to Submit this CR?';
        break;
      case 'REJECT':
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

  approveRequest(): void {
    this.utilsService.loadSpinner(true);
    const body = {
      entityId: this.selectedCr.id,
      action: this.selectedStatus,
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
          })
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
    this.selectedCr['comments'] = crInfo.message
    switch (this.selectedStatus) {
      case 'REJECT':
        this.header = 'Reject CR';
        this.content = 'Are you sure you want to Reject this CR?';
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
