import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { CommonApiService } from 'src/app/api/common-api.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { MentionConfig } from 'angular-mentions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecificationsService } from 'src/app/services/specifications.service';
import { SpecificationUtilsService } from '../../diff-viewer/specificationUtils.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'xnode-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  providers: [DatePipe],
})
export class AddTaskComponent {
  @Output() commentInfo: EventEmitter<object> = new EventEmitter<object>();
  @Input() visible: boolean = false;
  @Input() width?: string;
  @Input() reveiwerList: any;
  @Output() closeOverlay = new EventEmitter<any>();
  @Input() parentTitle: any;
  @Input() position?: string;
  @Input() placeHolder?: string;
  @Input() selectedContent: any;
  @Input() users: any;
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
  minDate!: Date;
  assinedUsers: string[] = [];
  isCommentEmpty: boolean = true;
  selectedDateLabel: any;
  priorityList: any = [
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' },
  ];
  files: any[] = [];
  selectedFile: any;
  maxSizeInBytes = 5 * 1024 * 1024;
  uploadedFiles: any[] = [];
  task: any;
  config: MentionConfig = {};
  addTaskForm: FormGroup;
  filteredReveiwers: any = [];
  suggestions: any;
  currentUser: any;
  product: any;
  isCommnetsPanelOpened: boolean = false;
  references: any;
  userList: any;

  constructor(
    public utils: UtilsService,
    private fb: FormBuilder,
    private commentsService: CommentsService,
    private commonApi: CommonApiService,
    private datePipe: DatePipe,
    private localStorageService: LocalStorageService,
    private specService: SpecificationsService,
    private specificationUtils: SpecificationUtilsService
  ) {
    this.minDate = new Date();
    this.addTaskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
      reviewersLOne: [[], [Validators.required]],
      files: [[]],
    });
    this.references = [];
  }
  ngOnInit() {
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.userList = this.localStorageService.getItem(StorageKeys.USERLIST);
    this.userList.forEach((element: any) => {
      element.name = element.first_name + ' ' + element.last_name;
    });
    this.currentUser = this.localStorageService.getItem(
      StorageKeys.CurrentUser
    );
    if (!this.parentId) {
      this.parentId = this.selectedContent.parentId;
    }
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
  createTask() {
    this.utils.loadSpinner(true);
    if (this.selectedText) {
      this.selectedContent['commentedtext'] = this.selectedText;
    }
    let body = {
      createdBy: this.currentUser.user_id,
      parentEntity: this.parentEntity,
      parentId: this.specItem.parentId,
      priority: '1',
      title: this.addTaskForm.value.title,
      description: this.addTaskForm.value.description,
      referenceContent:
        this.parentEntity === 'SPEC' ? this.selectedContent : {},
      attachments: this.uploadedFiles,
      references: this.setTemplateTypeInRefs(),
      followers: [],
      feedback: {},
      users: [
        {
          userId: this.currentUser.user_id,
          role: 'Owner'
        }
      ],
      assignee: this.currentUser.user_id,
      deadline: this.addTaskForm.value.duedate,
    };
    this.saveAsTask(body);
    this.addTaskForm.reset();
  }
  setTemplateTypeInRefs(): string {
    let productId = localStorage.getItem('record_id');
    this.addTaskForm.value.reviewersLOne.forEach((item: any) => {
      this.references.push({
        entity_type: 'User',
        entity_id: item.user_id,
      });
    });
    if (this.references.length == 0) this.references = [{}];
    if (this.parentEntity === 'SPEC') {
      this.references.forEach((obj: any) => {
        obj.template_type = 'TASK';
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
          this.addTaskForm.controls['files'].setValue(this.files);
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
    this.addTaskForm.get('files')?.value.splice(index, 1);
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
  filteredReveiwer(event: AutoCompleteCompleteEvent, reviewerType: string) {
    let filtered: any[] = [];
    let query = event.query;
    const selectedReviewers = this.addTaskForm.value.reviewersLOne.map(
      (reviewer: any) => reviewer.name.toLowerCase()
    );
    filtered = this.userList.filter(
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
  cancelTask() {
    this.closeOverlay.emit();
  }
  saveAsTask(body: any): void {
    if (this.parentTitle !== '' && this.parentTitle !== undefined) {
      body.referenceContent.parentTitle = this.parentTitle;
    } else {
      body.referenceContent.parentTitle = this.specItem.title;
    }
    this.commentsService
      .addTask(body)
      .then((commentsReponse: any) => {
        if (commentsReponse.statusText === 'Created') {
          this.comment = '';
          this.closeOverlay.emit();
          this.specService.getMeSpecLevelTaskList({ parentId: body.parentId });
          this.specificationUtils.openConversationPanel({
            openConversationPanel: true,
            parentTabIndex: 0,
            childTabIndex: 1,
          });
          this.utils.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: 'Task added successfully',
          });
          this.uploadedFiles = [];
          this.files = [];
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: commentsReponse?.data?.common?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }
}
