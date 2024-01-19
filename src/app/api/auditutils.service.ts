import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/components/services/utils.service';
import { BaseApiService } from './base-api.service';
import { LocalStorageService } from '../components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class AuditutilsService extends BaseApiService {
  override get apiUrl(): string {
    return environment.userUtilsApi;
  }
  currentUser: any;
  constructor(
    private utilsService: UtilsService,
    private storageService: LocalStorageService
  ) {
    super();
  }

  ngOnInit() {}

  postAudit(
    activity: any,
    attemptcount: number,
    attemptstatus: string,
    url: string,
    activityInfo?: any,
    useremail?: any,
    productid?: any
  ) {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    const body = {
      userId: this.currentUser?.user_id,
      activityTypeId: activity,
      activityInfo: activityInfo,
      attemptCount: attemptcount,
      attemptSuccess: attemptstatus,
      userEmail: useremail,
      productId: productid,
    };
    this.post(url, body)
      .then((response) => {
        if (response.data?.detail) {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: '',
            detail: response.data?.detail,
          });
        }
      })
      .catch((error) => {
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: error?.response?.data?.detail,
        });
      });
  }
}
