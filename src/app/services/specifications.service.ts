import { Injectable } from '@angular/core';
import { UtilsService } from '../components/services/utils.service';
import { SpecApiService } from '../api/spec-api.service';
import { SpecificationUtilsService } from '../pages/diff-viewer/specificationUtils.service';
import { CommentsService } from '../api/comments.service';

@Injectable({
  providedIn: 'root',
})
export class SpecificationsService {
  constructor(
    private utils: UtilsService,
    private specApiService: SpecApiService,
    private specUtils: SpecificationUtilsService,
    private commentsService: CommentsService
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

  getMeSpecInfo(params: any) {
    this.specApiService
      .getSpec({
        productId: params.productId,
        versionId: params.versionId,
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          response.data.forEach((element: any) => {
            element.content_data_type = 'BANNER';
          });
          console.log(' response.data', response.data);

          this.specUtils.saveSpecList(response.data);
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
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        console.log(err);
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
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        console.log(err);
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
          // this.specUtils._getMeUpdatedComments(response.data);
          // this.specUtils._openCommentsPanel(true);
          // this.specUtils._getSpecBasedOnVersionID(obj);
          // this.specUtils._tabToActive(obj.template_type);
          // this.router.navigate(['/specification']);
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
  }
}
