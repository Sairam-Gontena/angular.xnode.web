import { Component, Input } from '@angular/core';
import * as data from '../../constants/overview.json';
import { UserUtil } from '../../utils/user-util';
import { UtilsService } from 'src/app/components/services/utils.service';
import { AuditutilsService } from 'src/app/api/auditutils.service';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
@Component({
  selector: 'xnode-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverViewComponent {
  @Input() currentStep: number = 2;
  loading: boolean = true;
  templates: any;
  appName = localStorage.getItem('app_name');
  highlightedIndex: string | null = null;
  iconClicked: any;
  stepper: any;
  show = false;
  counter: any = 1;
  counter2: any = 1;
  jsondata: any;
  childData: any;
  currentUser?: any;
  overview: any;
  features: any;
  createOn: any;
  overviewData: any;
  product: any;
  username: string = '';

  constructor(
    private utils: UtilsService,
    private auditUtil: AuditutilsService,
    private naviApiService: NaviApiService,
    private storageService: LocalStorageService
  ) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.getMeStorageData();
    this.utils.getMeProductId.subscribe((data) => {
      if (data) {
        this.getMeStorageData();
      }
    })
  }

  getMeStorageData(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    if (this.product && !this.product?.has_insights) {
      this.utils.showProductStatusPopup(true);
      return;
    }
    this.utils.loadSpinner(true);
    this.jsondata = data?.data;
    this.templates = [{ label: localStorage.getItem('app_name') }];
    this.getMeOverview();
  }

  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
    this.iconClicked.emit(icon);
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    this.counter++;
  }
  prevStep(): void {
    this.stepper.prevStep();
    this.counter--;
  }
  setStep(step: any) {
    this.counter = step;
  }
  nextStep2() {
    this.stepper.nextStep();
    this.counter2++;
  }
  prevStep2() {
    this.stepper.prevStep();
    this.counter2--;
  }

  setStep2(step: any) {
    this.counter2 = step;
  }
  formatName(fullName: string): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0]} ${names[names.length - 1]}`;
    } else {
      return fullName;
    }
  }
  getMeOverview() {
    this.naviApiService
      .getOverview(this.currentUser?.email, this.product?.id)
      .then((response: any) => {
        if (response?.status === 200) {
          this.overview = response.data;
          this.features = response.data?.Features;
          this.appName = response?.data?.Title
            ? response?.data?.Title
            : response?.data?.title;
          this.createOn = response?.data?.created_on;
          localStorage.setItem(
            'app_name',
            response?.data?.Title
              ? response?.data?.Title
              : response?.data?.title
          );
          this.auditUtil.postAudit(
            'RETRIEVE_OVERVIEW',
            1,
            'SUCCESS',
            'user-audit'
          );
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_ME_OVERVIEW_RETRIEVE_OVERVIEW',
            1,
            'SUCCESS',
            'user-audit',
            user_audit_body,
            this.currentUser?.email,
            this.product?.id
          );
        } else {
          let user_audit_body = {
            method: 'GET',
            url: response?.request?.responseURL,
          };
          this.auditUtil.postAudit(
            'GET_ME_OVERVIEW_RETRIEVE_OVERVIEW',
            1,
            'FAILED',
            'user-audit',
            user_audit_body,
            this.currentUser?.email,
            this.product?.id
          );
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.detail,
          });
          this.auditUtil.postAudit(
            'RETRIEVE_OVERVIEW' + response?.data?.detail,
            1,
            'FAILURE',
            'user-audit'
          );
        }
        this.utils.loadSpinner(false);
      })
      .catch((error) => {
        let user_audit_body = {
          method: 'GET',
          url: error?.request?.responseURL,
        };
        this.auditUtil.postAudit(
          'GET_ME_OVERVIEW_RETRIEVE_OVERVIEW',
          1,
          'FAILED',
          'user-audit',
          user_audit_body,
          this.currentUser?.email,
          this.product?.id
        );
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
        this.utils.loadSpinner(false);
        this.auditUtil.postAudit(
          'RETRIEVE_OVERVIEW' + error,
          1,
          'FAILURE',
          'user-audit'
        );
      });
  }

  onChangeProduct(obj: any): void {
    this.getMeStorageData();
  }
}
