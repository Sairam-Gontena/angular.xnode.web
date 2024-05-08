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
import { environment } from 'src/environments/environment';
import _ from 'lodash';

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
  assignees:any;
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
      description: ['',[]],
      priority: ['MEDIUM', [Validators.required]],
      duedate: [new Date(this.getTodayDate()), [Validators.required]],
      reviewersLOne: [[], [Validators.required]],
      files: [[]],
    });
    this.assignees = [];
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
    this.getTodayDate();
  }

  getTodayDate() {
    this.onDateSelect(new Date());
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
  }

  removeReference(event: any) {
    this.assignees = this.assignees.filter((item: any) => (item.userId !== event.value.userId));
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
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1?.getDate() === date2?.getDate() &&
      date1?.getMonth() === date2?.getMonth() &&
      date1?.getFullYear() === date2?.getFullYear();
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

  createTask() {
    this.utils.loadSpinner(true);
    if (this.selectedText) {
      this.selectedContent['commentedtext'] = this.selectedText;
    }
    const deadline = this.convertToUTC(this.addTaskForm.value.duedate);
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
      references: [],
      followers: [],
      feedback: {},
      assignee: this.setTemplateTypeInRefs(),
      deadline: deadline,
    };
    this.addTaskForm.markAsUntouched();
    this.saveAsTask(body);
    this.addTaskForm.reset();
  }
  setTemplateTypeInRefs(): string {
    let productId = localStorage.getItem('record_id');
    this.addTaskForm.value.reviewersLOne.forEach((item: any) => {
      if (item) {
        this.assignees.push({
          role: "assignee", active: true, userId: item.userId ? item.userId : item.user_id, firstName: item.first_name ? item.first_name : item.firstName, lastName: item.last_name ? item.last_name : item.lastName, createdOn: new Date(), modifiedBy: this.currentUser.user_id
        });
      }
    });
    if (this.assignees.length == 0) this.assignees = [{}];
    if (this.parentEntity === 'SPEC') {
      this.assignees.forEach((obj: any) => {
        obj.template_type = 'TASK';
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
    this.addTaskForm.markAsUntouched();
    this.files = [];
    this.uploadedFiles = [];
    this.closeOverlay.emit();
  }
  saveAsTask(body: any): void {
    if (this.parentTitle !== '' && this.parentTitle !== undefined) {
      body.referenceContent.parentTitle = this.parentTitle;
    } else {
      body.referenceContent.parentTitle = this.specItem.title;
    }
    body.users = [];
    body.assignee = _.uniqBy(body.assignee, 'userId');
    body.assignee.forEach((item: any) => { body.users.push({ "userId": item?.userId, "role": "Contributor", "active": true }); });
    body.users = _.uniqBy(body.users, 'userId');
    body.users.unshift({ "userId": this.currentUser?.user_id, "role": "Owner", "active": true });
    console.log(body)
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
