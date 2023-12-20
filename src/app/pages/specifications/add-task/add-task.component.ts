import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { CommonApiService } from 'src/app/api/common-api.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { MentionConfig } from 'angular-mentions';
import { AuthApiService } from 'src/app/api/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageKeys } from 'src/models/storage-keys.enum';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'xnode-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  providers: [DatePipe]
})
export class AddTaskComponent {
  @Input() visible: boolean = false;
  @Input() width?: string;
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
  reveiwerList: any;
  filteredReveiwers: any = [];
  suggestions: any;
  currentUser: any;
  product: any;
  isCommnetsPanelOpened: boolean = false;
  references: any;
  assignAsaTask: boolean = false;

  constructor(public utils: UtilsService,
    private fb: FormBuilder,
    private commentsService: CommentsService,
    private commonApi: CommonApiService,
    private datePipe: DatePipe,
    private authApiService: AuthApiService,
    private utilsService: UtilsService,
    private specUtils: SpecUtilsService,
    private localStorageService: LocalStorageService,
  ) {
    this.minDate = new Date();
    this.addTaskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
      reviewersLOne: [[], [Validators.required]],
      files: [[]]
    });
    this.references = [];
    this.specUtils.openCommentsPanel.subscribe((event: boolean) => {
      this.isCommnetsPanelOpened = event;
    });
  }
  ngOnInit(): void {
    // this.utilsService.loadSpinner(true);
    this.product = this.localStorageService.getItem(StorageKeys.Product);
    this.currentUser = this.localStorageService.getItem(
      StorageKeys.CurrentUser
    );
    // if (this.users) {
    //   this.users.forEach((element: any) => {
    //     element.name = element?.first_name + " " + element?.last_name;
    //   });
    // }
    // this.config = {
    //   labelKey: 'name',
    //   mentionSelect: this.format.bind(this),
    // };
    this.getUserByAccountId();
  }
  // format(item: any) {
  //   const entityId = item.user_id;
  //   const isDuplicate = this.references.some((reference: any) => reference.entity_id === entityId);
  //   if (!isDuplicate) {
  //     this.references.push({ entity_type: "User", entity_id: entityId, product_id: this.product?.id || null });
  //   }
  //   return `@${item.first_name} ${item.last_name},`;
  // }
  onDateSelect(event: any): void {
    const selectedDate: Date = event;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const formattedSelectedDate = this.datePipe.transform(selectedDate, 'shortDate');
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
  createTask(event: any) {
    console.log(this.addTaskForm.value, '000000000000')
    console.log('Parent Entity:', this.parentEntity);
    console.log('Parent ID:', this.parentId);
    const body = {
      createdBy: this.currentUser.user_id,
      parentEntity: this.parentEntity,
      parentId: this.parentId,
      priority: '1',
      title: this.addTaskForm.value.title,
      description: this.addTaskForm.value.description,
      referenceContent: this.parentEntity === 'SPEC' ? this.selectedContent : {},
      attachments: this.uploadedFiles,
      references: this.setTemplateTypeInRefs(),
      followers: [],
      feedback: {},
      assignee: this.currentUser.user_id,
      deadline: this.addTaskForm.value.duedate
    };
    this.saveAsTask(body);
  }
  setTemplateTypeInRefs(): string {
    let productId = localStorage.getItem('record_id');
    if (this.parentEntity === 'SPEC' && this.assignAsaTask) {
      this.references.forEach((obj: any) => {
        obj.template_type = 'TASK';
        obj.product_id = productId;
      })
    } else if (this.parentEntity === 'SPEC' && !this.assignAsaTask) {
      this.references.forEach((obj: any) => {
        obj.template_type = 'COMMENT';
        obj.product_id = productId;
      })
    } else {
      this.references.forEach((obj: any) => {
        obj.template_type = this.parentEntity;
        obj.product_id = productId;
      })
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
          this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'File size should not exceed 5mb' });
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
      const res = await this.commonApi.postFile('file-azure/upload', formData, { headers });
      if (res.statusText === 'Created') {
        this.uploadedFiles.push(res.data.id);
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'File uploaded successfully' });
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: res?.data });
      }
    } catch (error) {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: 'Error' });

    } finally {
      this.utils.loadSpinner(false);
    }
  }
  filteredReveiwer(event: AutoCompleteCompleteEvent, reviewerType: string) {
    let filtered: any[] = [];
    let query = event.query;

    const selectedReviewers = this.addTaskForm.value.reviewersLOne.map((reviewer: any) => reviewer.name.toLowerCase());

    filtered = this.reveiwerList.filter(
      (reviewer: any) =>
        reviewer.name.toLowerCase().indexOf(query.toLowerCase()) === 0 && !selectedReviewers.includes(reviewer.name.toLowerCase())
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

  getUserByAccountId(): void {
    this.authApiService
      .getAllUsers(
        'user/get_all_users?account_id=' + this.currentUser?.account_id
      )
      .then((response: any) => {
        if (response.status === 200 && response?.data) {
          response.data.forEach((element: any) => {
            element.name = element.first_name + ' ' + element.last_name;
          });
          this.reveiwerList = response.data;
        } else {
          this.utilsService.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: response.data.detail,
          });
          this.utilsService.loadSpinner(false);
        }
      })
      .catch((err: any) => {
        this.utilsService.loadSpinner(false);
        this.utilsService.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  saveAsTask(body: any): void {
    console.log(this.parentTitle, '7777777777777')
    if (!body.referenceContent) {
      body.referenceContent = {};
    }
    if (this.parentTitle !== '' && this.parentTitle !== undefined) {
      body.referenceContent.parentTitle = this.parentTitle;
    } else {
      body.referenceContent.parentTitle = this.specItem.title;
    }
    this.commentsService.addTask(body).then((commentsReponse: any) => {
      if (commentsReponse.statusText === 'Created') {
        if (!this.isCommnetsPanelOpened)
          this.specUtils._openCommentsPanel(true);
        this.comment = '';
        this.closeOverlay.emit();
        this.specUtils._commentsCrActiveTab(false);
        this.specUtils._tabToActive('TASK');
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Task added successfully' });
        this.uploadedFiles = [];
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: commentsReponse?.data?.common?.status });
      }
      this.utils.loadSpinner(false);
      // this.assignAsaTask = false;
    }).catch(err => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
      // this.assignAsaTask = false;
    })
  }
}
