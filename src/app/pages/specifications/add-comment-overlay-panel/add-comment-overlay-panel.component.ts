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
  assinedUsers: string[] = [];
  assignAsaTask: boolean = false;
  currentUser: any;
  product: any;
  listToMention: any;
  mentionConfig: MentionConfig = {};
  references: any;
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
    const isDuplicate = this.references.some(
      (reference: any) => reference.entity_id === entityId
    );
    if (!isDuplicate) {
      this.references.push({
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
      this.references.forEach((obj: any) => {
        obj.template_type = 'TASK';
        obj.product_id = productId;
      });
    } else if (this.parentEntity === 'SPEC' && !this.assignAsaTask) {
      this.references.forEach((obj: any) => {
        obj.template_type = 'COMMENT';
        obj.product_id = productId;
      });
    } else {
      this.references.forEach((obj: any) => {
        obj.template_type = this.parentEntity;
        obj.product_id = productId;
      });
    }
    return this.references;
  }

  onDateSelect(event: any): void {
    const selectedDate: Date = event;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const formattedSelectedDate = this.datePipe.transform(
      selectedDate,
      'shortDate'
    );
    const formattedToday = this.datePipe.transform(today, 'shortDate');
    const formattedTomorrow = this.datePipe.transform(tomorrow, 'shortDate');

    let label: any;

    if (formattedSelectedDate === formattedToday) {
      label = 'Today';
    } else if (formattedSelectedDate === formattedTomorrow) {
      label = 'Tomorrow';
    } else {
      label = formattedSelectedDate;
    }

    this.selectedDateLabel = label;
  }

  handleCrTabs(): void {
    this.commentInfo.emit({
      message: this.comment,
      attachments: this.uploadedFiles,
      referenceContent:
        this.parentEntity === 'SPEC' ? this.selectedContent : {},
      parentId: this.selectedContent.parentId,
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
      body = {
        // createdBy: this.currentUser.user_id,
        topParentId: this.topParentId, // For new comment it is 'null' and reply level this should be top comment id.
        parentEntity: this.parentEntity,
        parentId: this.selectedContent.parentId, // It should be spec id at New comment level and parent commment id at reply level
        message: this.comment,
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
          // createdBy: this.currentUser.user_id,
          topParentId: this.topParentId, // For new comment it is 'null' and reply level this should be top comment id.
          parentEntity: this.parentEntity,
          parentId: this.selectedContent.parentId, // It should be spec id at New comment level and parent commment id at reply level
          message: this.comment,
          referenceContent:
            this.parentEntity === 'SPEC' ? this.selectedContent : {},
          attachments: this.uploadedFiles,
          references: this.setTemplateTypeInRefs(),
          followers: [],
          feedback: {},
        };
        console.log('bobdy', body);

        this.saveComment(body);
      } else {
        this.prepareDataToSaveAsTask();
      }
    } else {
      console.log('bobdy', body);
      console.log('sele', this.selectedContent);

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
        if (commentsReponse.statusText === 'Created') {
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
        parentId: this.selectedContent.parentId,
      });
      this.specificationUtils.openConversationPanel({
        openConversationPanel: true,
        parentTabIndex: 0,
        childTabIndex: 1,
      });
    } else {
      this.specService.getMeSpecLevelCommentsList({
        parentId: this.selectedContent.parentId,
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

  getMeSpecLevelCommentsList() {
    this.utils.loadSpinner(true);
    this.commentsService
      .getComments({
        parentId: this.selectedContent.parentId,
        isReplyCountRequired: true,
      })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.specUtils._openCommentsPanel(true);
          this.specUtils._tabToActive('COMMENT');
          this.specUtils._getMeUpdatedComments(response.data);
        }
        this.utils.loadSpinner(false);
      })
      .catch((err: any) => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
  }

  getMeSpecLevelTaskList() {
    this.utils.loadSpinner(true);
    this.commentsService
      .getTasks({
        parentId: this.selectedContent.parentId,
        isReplyCountRequired: true,
      })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.specUtils._openCommentsPanel(true);
          this.specUtils._tabToActive('TASK');
          this.specUtils._getMeUpdatedComments(response.data);
        }
        this.utils.loadSpinner(false);
      })
      .catch((err: any) => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
  }
  prepareDataToSaveAsTask(): void {
    let body;
    if (this.action === 'EDIT') {
      body = {
        // createdBy: this.currentUser.user_id,
        id: this.selectedComment.id,
        parentEntity: this.parentEntity,
        parentId: this.selectedComment.parentId,
        priority: '1',
        title: this.comment,
        description: this.comment,
        referenceContent:
          this.parentEntity === 'SPEC' ? this.selectedContent : {},
        attachments: [],
        references: this.setTemplateTypeInRefs(),
        followers: [],
        feedback: {},
        assignee: this.selectedComment.assignee.userId,
        deadline: '',
      };
    } else if (this.action !== 'EDIT') {
      body = {
        // createdBy: this.currentUser.user_id,
        parentEntity: this.parentEntity,
        parentId: this.selectedContent.parentId,
        priority: '1',
        title: this.comment,
        description: this.comment,
        referenceContent:
          this.parentEntity === 'SPEC' ? this.selectedContent : {},
        attachments: this.uploadedFiles,
        references: this.setTemplateTypeInRefs(),
        followers: [],
        feedback: {},
        assignee: this.currentUser.user_id,
        deadline: '',
      };
    }
    this.saveAsTask(body);
  }

  saveAsTask(body: any): void {
    this.commentsService
      .addTask(body)
      .then((commentsReponse: any) => {
        if (commentsReponse.statusText === 'Created') {
          this.comment = '';
          this.closeOverlay.emit();
          this.utils.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: 'Task added successfully',
          });
          this.uploadedFiles = [];
          this.specService.getMeSpecLevelTaskList({
            parentId: this.selectedContent.parentId,
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
        'Content-Type': 'application/json',
      };
      await this.fileUploadCall(formData, headers); // await here
    };

    reader.readAsArrayBuffer(file); // Move this line outside the onload function
  }

  async fileUploadCall(formData: any, headers: any) {
    try {
      this.utils.loadSpinner(true);
      const res = await this.commonApi.uploadFile(formData, {
        headers,
      });
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
