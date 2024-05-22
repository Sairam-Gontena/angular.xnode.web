import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import * as _ from 'lodash';
import { MentionConfig } from 'angular-mentions';
import { CommonApiService } from 'src/app/api/common-api.service';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { SpecificationUtilsService } from '../../diff-viewer/specificationUtils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'xnode-add-comment-overlay-panel',
  templateUrl: './add-comment-overlay-panel.component.html',
  styleUrls: ['./add-comment-overlay-panel.component.scss'],
  providers: [DatePipe],
})
export class AddCommentOverlayPanelComponent implements OnInit {
  @Output() commentInfo: EventEmitter<object> = new EventEmitter<object>();
  @Output() closeOverlay = new EventEmitter<any>();
  @Input() parentTitle: any;
  @Input() position?: string;
  @Input() placeHolder?: string;
  @Input() selectedContent: any;
  @Input() width?: string;
  @Input() comment: string = '';
  @Input() specItem: any;
  @Input() parentEntity: any;
  @Input() parentId: any;
  @Input() topParentId: any;
  @Input() commentType: string = '';
  @Input() selectedComment: any;
  @Input() action: any;
  @Input() selectedText: any;
  @Input() specId: any;
  @Input() activeIndex: any;
  @Input() from: any;
  @Input() AssignedFrom: any;
  @Input() component: any;
  deadlineDate: any;
  assinedUsers: string[] = [];
  assignAsaTask: boolean = false;
  currentUser: any;
  product: any;
  listToMention: any;
  mentionConfig: MentionConfig = {};
  references: any;
  assignees: any;
  isCommnetsPanelOpened: boolean = false;
  isUploading: boolean = false;
  files: any[] = [];
  selectedFile: any;
  maxSizeInBytes = 5 * 1024 * 1024;
  uploadedFiles: any[] = [];
  selectedDateLabel: any;
  isCommentEmpty: boolean = true;
  minDate!: Date;
  @Input() users: any;

  constructor(
    public utils: UtilsService,
    private commentsService: CommentsService,
    private commonApi: CommonApiService,
    private datePipe: DatePipe,
    private storageService: LocalStorageService,
    private specUtils: SpecUtilsService,
    private specService: SpecificationsService,
    private specificationUtils: SpecificationUtilsService
  ) {
    this.minDate = new Date();
    this.references = [];
    this.assignees = [];
    this.specUtils.openCommentsPanel.subscribe((event: boolean) => {
      this.isCommnetsPanelOpened = event;
    });
  }
  ngOnInit(): void {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.users = this.storageService.getItem(StorageKeys.USERLIST);
    if (this.users)
      this.users.forEach((element: any) => {
        element.name = element?.first_name + ' ' + element?.last_name;
      });
    this.mentionConfig = {
      labelKey: 'name',
      mentionSelect: this.format.bind(this),
    };
    if (this.from == 'cr-tabs') {
      this.assignAsaTask = true;
    }

  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === ' ' && this.component == 'crTabs') {
      event.stopPropagation();
    }
  }

  format(item: any) {
    const entityId = item.user_id;
    const isDuplicate = this.assignees.some(
      (reference: any) => reference.entity_id === entityId
    );
    if (!isDuplicate) {
      this.assignees.push({
        entity_type: 'User',
        entity_id: entityId,
        product_id: this.product?.id || null,
      });
    }
    return `@${item.first_name} ${item.last_name},`;
  }

  setTemplateTypeInRefs(): string {
    let productId = localStorage.getItem('record_id');
    if (this.parentEntity === 'SPEC' && this.assignAsaTask) {
      this.assignees.forEach((obj: any) => {
        obj.userId = obj.entity_id;
        obj.role = "Contributor";
        obj.active = true;
        obj.createdOn = new Date();
        obj.modifiedBy = this.currentUser.user_id;
        obj.template_type = 'TASK';
        obj.product_id = productId;
      });
    } else if (this.parentEntity === 'SPEC' && !this.assignAsaTask) {
      this.assignees.forEach((obj: any) => {
        obj.userId = obj.entity_id;
        obj.template_type = 'COMMENT';
        obj.product_id = productId;
      });
    } else {
      this.assignees.forEach((obj: any) => {
        obj.template_type = this.parentEntity;
        obj.product_id = productId;
      });
    }
    return this.assignees;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1?.getDate() === date2?.getDate() &&
      date1?.getMonth() === date2?.getMonth() &&
      date1?.getFullYear() === date2?.getFullYear();
  }

  onDateSelect(event: any): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let label: any;
    if (this.isSameDay(event, today)) {
      label = 'Today';
    } else if (this.isSameDay(event, tomorrow)) {
      label = 'Tomorrow';
    } else {
      label = event.toLocaleDateString('en-US');
    }
    this.selectedDateLabel = label;
    this.selectedDateLabel = label;
  }

  handleCrTabs(): void {
    this.commentInfo.emit({
      message: this.comment,
      attachments: this.uploadedFiles,
      referenceContent: this.parentEntity === 'SPEC' ? this.selectedContent : {},
      parentId: this.selectedContent?.parentId,
    });
  }
  onClickSend(): void {
    if (this.from == 'cr-tabs') {
      this.handleCrTabs();
      return;
    }
    this.utils.loadSpinner(true);
    if (this.selectedText) {
      this.selectedContent['commentedtext'] = this.selectedText;
      this.commentType = 'comment';
    }
    let body;
    if (this.action === 'EDIT') {
      body = this.selectedComment;
      body.message = this.comment;
    } else {
      let parentId =
        this.action === 'REPLY'
          ? this.selectedComment.id
          : this.selectedContent?.parentId;
      body = {
        createdBy: this.currentUser.user_id,
        topParentId: this.topParentId, // For new comment it is 'null' and reply level this should be top comment id.
        parentEntity: this.parentEntity,
        parentId: parentId, // It should be spec id at New comment level and parent commment id at reply level
        message: this.comment,
        users: [
          {
            userId: this.currentUser.user_id,
            role: 'Owner'
          }
        ],
        referenceContent:
          this.parentEntity === 'SPEC' ? this.selectedContent : {},
        attachments: this.uploadedFiles,
        references: this.setTemplateTypeInRefs(),
        followers: [],
        feedback: {},
      };
    }
    if (this.assignAsaTask || this.activeIndex === 1) {
      if (this.action === 'REPLY') {
        body = {
          topParentId: this.topParentId, // For new comment it is 'null' and reply level this should be top comment id.
          parentEntity: this.parentEntity,
          parentId: this.selectedComment.id, // It should be spec id at New comment level and parent commment id at reply level
          message: this.comment,
          referenceContent:
            this.parentEntity === 'SPEC' ? this.selectedContent : {},
          attachments: this.uploadedFiles,
          references: this.setTemplateTypeInRefs(),
          followers: [],
          feedback: {},
        };
        this.saveComment(body);
      } else {
        this.prepareDataToSaveAsTask();
      }
    } else {
      this.saveComment(body);
    }
  }

  saveComment(body: any): void {
    if (this.parentTitle != '' && this.parentTitle != undefined) {
      body.referenceContent.parentTitle = this.parentTitle;
    }
    this.commentsService
      .addComments(body)
      .then((commentsReponse: any) => {
        if (commentsReponse.statusText === 'Created' || commentsReponse.status == 200) {
          this.utils.loadSpinner(false);
          this.prepareDataToDisplayOnCommentsPanel();
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: commentsReponse?.data?.common?.status,
          });
          this.utils.loadSpinner(false);
        }
      })
      .catch((err: any) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  prepareDataToDisplayOnCommentsPanel(): void {
    this.comment = '';
    let detail = '';
    if (this.action === 'EDIT') {
      detail = 'Comment updated successfully';
    } else {
      detail = 'Comment added successfully';
    }
    if (this.assignAsaTask || this.activeIndex === 1) {
      this.specService.getMeSpecLevelTaskList({
        parentId: this.selectedContent?.parentId ? this.selectedContent?.parentId : this.parentId,
      });
      this.specificationUtils.openConversationPanel({
        openConversationPanel: true,
        parentTabIndex: 0,
        childTabIndex: 1,
      });
    } else {
      this.specService.getMeSpecLevelCommentsList({
        parentId: this.selectedContent.parentId ? this.selectedContent?.parentId : this.parentId,
      });
      this.specificationUtils.openConversationPanel({
        openConversationPanel: true,
        parentTabIndex: 0,
        childTabIndex: 0,
      });
    }
    this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail });
    this.uploadedFiles = [];
    this.files = [];
    this.closeOverlay.emit();
  }

  convertToUTC(date: Date): Date {
    if (typeof (date) == 'string' || !date)
      date = new Date(date);
    let returnDateInTime: any = new Date(date).getTime();
    if (this.selectedDateLabel == 'Today') {
      returnDateInTime = new Date().toISOString();
    } else {
      const selectedDate = this.datePipe.transform(new Date(date), 'MM/dd/yyyy');
      const time: any = this.datePipe.transform(new Date(), 'HH:mm:ss');
      returnDateInTime = new Date(selectedDate + ' ' + time).toISOString()
    }
    return returnDateInTime;
  }

  prepareDataToSaveAsTask(): void {
    const deadline = this.convertToUTC(this.deadlineDate);
    let body;
    if (this.action === 'EDIT') {
      body = {
        id: this.selectedComment.id,
        parentEntity: this.parentEntity,
        parentId: this.selectedComment.parentId,
        priority: 'MEDIUM',
        title: this.comment,
        description: this.comment,
        referenceContent:
          this.parentEntity === 'SPEC'
            ? this.selectedContent
            : this.selectedComment?.referenceContent
              ? this.selectedComment.referenceContent
              : {},
        attachments: this.uploadedFiles,
        references: [],
        followers: [],
        feedback: {},
        assignee: this.setTemplateTypeInRefs(),
        deadline: deadline,
      };
    } else if (this.action !== 'EDIT') {
      body = {
        parentEntity: this.parentEntity,
        parentId: this.selectedContent.parentId,
        priority: 'MEDIUM',
        title: this.comment,
        description: this.comment,
        referenceContent:
          this.parentEntity === 'SPEC' ? this.selectedContent : {},
        attachments: this.uploadedFiles,
        references: [],
        followers: [],
        feedback: {},
        assignee: this.setTemplateTypeInRefs(),
        deadline: deadline,
      };
    }
    this.saveAsTask(body);
  }

  saveAsTask(body: any): void {
    body.users = [];
    body.assignee = _.uniqBy(body.assignee, 'userId');
    body.assignee.forEach((item: any) => { body.users.push({ "userId": item?.userId, "role": "Contributor", "active": true }); });
    body.users = _.uniqBy(body.users, 'userId');
    body.users.unshift({ "userId": this.currentUser?.user_id, "role": "Owner", "active": true });
    this.commentsService.addTask(body).then((commentsReponse: any) => {
      this.utils.loadSpinner(false);
      if (commentsReponse.statusText === 'Created' || commentsReponse.status == 200) {
        this.comment = '';
        this.closeOverlay.emit();
        this.utils.loadToaster({
          severity: 'success',
          summary: 'SUCCESS',
          detail: 'Task added successfully',
        });
        this.uploadedFiles = [];
        this.specService.getMeSpecLevelTaskList({
          parentId: this.selectedContent?.parentId,
        });
        this.specificationUtils.openConversationPanel({
          openConversationPanel: true,
          parentTabIndex: 0,
          childTabIndex: 1,
        });
      } else {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: commentsReponse?.data?.common?.status,
        });
      }
      this.utils.loadSpinner(false);
      this.assignAsaTask = false;
    })
      .catch((err: any) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
        this.assignAsaTask = false;
      });
  }

  onChangeComment() {
    this.isCommentEmpty = this.comment.trim().length === 0;
    this.checkAndGetAssinedUsers();
  }

  checkAndGetAssinedUsers(): void {
    const regex = /@(\w+)/g;
    this.assinedUsers = [];
    let match;
    while ((match = regex.exec(this.comment)) !== null) {
      this.assinedUsers.push(match[1]);
    }
  }

  fileBrowseHandler(event: any) {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSizeInBytes) {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: 'File size should not exceed 5mb',
          });
        } else {
          this.prepareFilesList(event.target.files);
        }
      }
    }
  }

  prepareFilesList(files: Array<any>) {
    let item: any;
    for (item of files) {
      this.files.push(item);
    }
    this.readFileContent(item);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.uploadedFiles.splice(index, 1);
  }

  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  private async readFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const formData = new FormData();
      formData.append('file', file);
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Ocp-Apim-Subscription-Key': environment.apimSubscriptionKey
      };
      await this.fileUploadCall(formData, headers); // await here
    };

    reader.readAsArrayBuffer(file); // Move this line outside the onload function
  }

  async fileUploadCall(formData: any, headers: any) {
    try {
      this.utils.loadSpinner(true);
      const res = await this.commonApi.uploadFile(formData, { headers });
      if (res.statusText === 'Created') {
        this.uploadedFiles.push(res.data.id);
        this.utils.loadToaster({
          severity: 'success',
          summary: 'SUCCESS',
          detail: 'File uploaded successfully',
        });
      } else {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: res?.data,
        });
      }
    } catch (error) {
      this.utils.loadToaster({
        severity: 'error',
        summary: 'Error',
        detail: 'Error',
      });
    } finally {
      this.utils.loadSpinner(false);
    }
  }
}
