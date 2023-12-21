import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService extends BaseApiService {
  override get apiUrl(): string {
    return environment.commentsApiUrl;
  }

  constructor() {
    super();
  }

  getComments(params?: any) {
    let url = 'comment';
    return this.get(url, params);
  }
  getCommentsByProductId(params?: any) {
    let url = 'comments-by-productId';
    return this.get(url, params);
  }

  getTasks(params?: any) {
    let url = 'task';
    return this.get(url, params);
  }

  updateComments(body: any) {
    return this.patch('specs/update-comments/', body);
  }

  addComments(body: any) {
    return this.post('comment', body);
  }

  addTask(body: any) {
    return this.post('task', body);
  }

  deletComment(id: any) {
    return this.delete('comment/' + id);
  }

  deletTask(id: any) {
    return this.delete('task/' + id);
  }

  addVersion(body: any) {
    return this.post('product-version', body);
  }

  getVersions(body: any) {
    return this.get('product-version', body);
  }

  getChangeRequestList(body: any) {
    return this.get('change-request', body);
  }

  createCr(body: any) {
    return this.post('change-request', body);
  }

  linkCr(body: any) {
    return this.post('cr-entity-mapping', body);
  }

  approveCr(body: any) {
    return this.post('change-request', body);
  }

  rejectCr(body: any) {
    return this.post('change-request', body);
  }

  deleteCrEntity(body: any) {
    return this.delete('cr-entity-mapping/' + body.entityType + '/' + body.id);
  }

  getCrActions(body: any) {
    return this.get('workflow-instance/actions/' + body.entityId + '/' + body.userId);
  }

  performCrActions(body: any) {
    return this.put('workflow-instance/perform-action', body);
  }

  reviewerListByAccountId(body: any) {
    return this.get('review-policy/policies/' + body.accountId + '/' + body.phase);
  }

  getCrList(body: any) {
    return this.get('change-request', body);
  }

  publishApp(body: any) {
    return this.get('product-spec/publish', body);
  }
}
