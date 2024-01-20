import { Injectable } from '@angular/core';
import { UtilsService } from '../components/services/utils.service';
import { SpecApiService } from '../api/spec-api.service';
import { SpecificationUtilsService } from '../pages/diff-viewer/specificationUtils.service';
import { CommentsService } from '../api/comments.service';
import { isArray } from 'lodash';
import { LocalStorageService } from '../components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class SpecificationsService {
  constructor(
    private utils: UtilsService,
    private specApiService: SpecApiService,
    private specUtils: SpecificationUtilsService,
    private commentsService: CommentsService,
    private storageService: LocalStorageService
  ) {}

  getVersions(
    productId: string,
    successCallback?: (data: any) => void,
    errorCallback?: (error: any) => void
  ) {
    this.specApiService
      .getVersionIds(productId)
      .then((response) => {
        if (response.status === 200 && response.data) {
          this.specUtils.saveVerions(response.data);
          if (successCallback) successCallback(response.data);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'Error',
            detail: 'Network Error',
          });
        }
      })
      .catch((err: any) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
      });
  }

  getMeSpecInfo(
    params: any,
    successCallback?: (data: any) => void,
    errorCallback?: (error: any) => void
  ) {
    this.specApiService
      .getSpec({
        productId: params.productId,
        versionId: params.versionId,
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          response.data.forEach((specObj: any, eleIndex: any) => {
            specObj.content_data_type = 'BANNER';
            if (specObj.title === 'Technical Specifications') {
              specObj.content.push({
                title: 'Open API Spec',
                content_data_type: 'SWAGGER',
                id: eleIndex,
              });
            }
            if (specObj?.title == 'Quality Assurance') {
              let content = specObj.content;
              if (Array.isArray(specObj.content)) {
                specObj.content = [];
              }
              specObj.content.push({
                title: 'Quality Assurance',
                content: content,
                id: specObj.id,
              });
            }
            if (isArray(specObj.content)) {
              specObj.content.forEach((element: any, index: any) => {
                if (element.title === 'Data Model Table Data') {
                  specObj.content.slice(index, 1);
                }
                if (element.title === 'User Personas') {
                  element.content_data_type = 'USER_PERSONAS';
                } else if (element.title === 'Usecases') {
                  element.content_data_type = 'USECASES';
                } else if (element.title === 'Workflows') {
                  element.content_data_type = 'WORKFLOWS';
                } else if (element.title === 'User Roles') {
                  element.content_data_type = 'USER_ROLES';
                } else if (element.title === 'Dashboards') {
                  element.content_data_type = 'DASHBOARD';
                } else if (
                  element.title === 'Business Rules' ||
                  element.title === 'Functional Dependencies' ||
                  element.title === 'Data Dictionary' ||
                  element.title === 'User Interface'
                ) {
                  element.content_data_type = 'JSON_TABLE';
                } else if (element.title === 'Data Quality Checks') {
                  element.content_data_type = 'TABLE';
                } else if (element.title === 'Data Model') {
                  element.content_data_type = 'DATA_MODEL';
                } else if (element.title === 'Quality Assurance') {
                  element.content_data_type = 'QUALITY_ASSURANCE';
                } else if (element.title === 'Data Model Table Data') {
                  specObj.content.splice(index, 1);
                }
              });
            }
          });
          this.specUtils.saveSpecList(response.data);

          this.storageService.saveItem(StorageKeys.SPEC_DATA, response.data);
          if (successCallback) successCallback(response.data);
        }
        this.utils.loadSpinner(false);
      })
      .catch((error) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      });
  }

  getMeSpecLevelCommentsList(data: any) {
    this.utils.loadSpinner(true);
    this.commentsService
      .getComments({ parentId: data.parentId, isReplyCountRequired: true })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.specUtils.saveCommentList(response.data);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.common?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.utils.loadSpinner(false);
      });
  }

  getMeSpecLevelTaskList(data: any) {
    this.utils.loadSpinner(true);
    this.commentsService
      .getTasks({ parentId: data.parentId, isReplyCountRequired: true })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.specUtils.saveTaskList(response.data);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.common?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.utils.loadSpinner(false);
      });
  }

  getMeAllComments(obj: any) {
    this.utils.loadSpinner(true);
    this.commentsService
      .getCommentsByProductId({
        productId: obj.productId,
        versionId: obj.versionId,
      })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.specUtils.saveCommentList(response.data);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.common?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  getMeAllTasks(obj: any) {
    this.utils.loadSpinner(true);
    this.commentsService
      .getTasksByProductId({
        productId: obj.productId,
        versionId: obj.versionId,
      })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.specUtils.saveTaskList(response.data);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response?.data?.common?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.utils.loadSpinner(false);
      });
  }

  getMeCrList(obj: any) {
    this.utils.loadSpinner(true);
    this.commentsService
      .getCrList({
        productId: obj.productId,
      })
      .then((res: any) => {
        if (res && res.data) {
          this.specUtils.saveCrList(res.data);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res?.data?.common?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err: any) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.utils.loadSpinner(false);
      });
  }
}
