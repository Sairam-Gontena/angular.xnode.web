import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import * as _ from "lodash";
import { SidePanel } from 'src/models/side-panel.enum';
import { MentionConfig } from 'angular-mentions';
import { CommonApiService } from 'src/app/api/common-api.service';
@Component({
  selector: 'xnode-add-comment-overlay-panel',
  templateUrl: './add-comment-overlay-panel.component.html',
  styleUrls: ['./add-comment-overlay-panel.component.scss']
})

export class AddCommentOverlayPanelComponent implements OnInit {
  @Output() closeOverlay = new EventEmitter<any>();
  @Input() position?: string;
  @Input() placeHolder?: string;
  @Input() selectedContent: any;
  @Input() width?: string;
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
  assinedUsers: string[] = [];
  assignAsaTask: boolean = false;
  currentUser: any;
  product: any;
  listToMention: any;
  config: MentionConfig = {};
  references: any;
  isCommnetsPanelOpened: boolean = false;
  isUploading: boolean = false;
  files: any[] = [];
  selectedFile: any;
  maxSizeInBytes = 5 * 1024 * 1024;
  uploadedFiles: any[] = [];

  constructor(public utils: UtilsService,
    private commentsService: CommentsService,
    private commonApi: CommonApiService,
  ) {
    this.references = [];
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
    }

    this.utils.sidePanelChanged.subscribe((pnl: SidePanel) => {
      this.isCommnetsPanelOpened = pnl === SidePanel.Comments;
    });
  }

  ngOnInit(): void {
    let data = [] as any[];
    if (this.users) {
      this.users.forEach((element: any) => {
        element.name = element?.first_name + " " + element?.last_name;
      });
    }
    this.config = {
      labelKey: 'name',
      mentionSelect: this.format.bind(this),
    };
  }

  format(item: any) {
    let outputObject: Record<string, any> = {};
    outputObject[item.user_id] = item.first_name + " " + item.last_name;
    this.references = outputObject;
    return `@${item.first_name} ${item.last_name},`
  }

  onClickSend(): void {
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
        "createdBy": this.currentUser.user_id,
        "topParentId": this.topParentId, // For new comment it is 'null' and reply level this should be top comment id.
        "parentEntity": this.parentEntity,
        "parentId": this.parentId, // It should be spec id at New comment level and parent commment id at reply level
        "message": this.comment,
        "referenceContent": this.parentEntity === 'SPEC' ? this.selectedContent : {},
        "attachments": this.uploadedFiles,
        "references": { Users: this.references },
        "followers": [],
        "feedback": {}
      }
    }
    if (this.assignAsaTask || this.activeIndex === 1) {
      this.prepareDataToSaveAsTask()
    } else {
      this.saveComment(body);
    }
  }

  saveComment(body: any): void {
    this.commentsService.addComments(body).then((commentsReponse: any) => {
      if (commentsReponse.statusText === 'Created') {
        this.utils.toggleTaskAssign(false);
        if (this.isCommnetsPanelOpened)
          this.utils.updateConversationList('COMMENT');
        else
          this.utils.openOrClosePanel(SidePanel.Comments);
        this.comment = '';
        this.closeOverlay.emit();
        let detail = 'Comment added successfully'
        if (this.action == 'EDIT') {
          detail = 'Comment edited successfully';
        }
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail });
        this.uploadedFiles = [];
      } else {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: commentsReponse?.data?.common?.status });
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  prepareDataToSaveAsTask(): void {
    let body;
    if (this.action === 'EDIT') {
      body = {
        "id": this.selectedComment.id,
        "parentEntity": this.parentEntity,
        "parentId": this.selectedComment.parentId,
        "priority": '1',
        "title": this.comment,
        "description": this.comment,
        "attachments": [],
        "references": this.selectedComment.references,
        "followers": [],
        "feedback": {},
        "status": "",
        "assignee": this.selectedComment.assignee.userId,
        "deadline": ""
      }

    } else {
      body = {
        "parentEntity": this.parentEntity,
        "parentId": this.parentId,
        "priority": '1',
        "title": this.comment,
        "description": this.comment,
        "attachments": [],
        "references": { Users: this.references },
        "followers": [],
        "feedback": {},
        "status": "",
        "assignee": this.currentUser.user_id,
        "deadline": ""
      }
    }
    this.saveAsTask(body);
  }

  saveAsTask(body: any): void {
    this.commentsService.addTask(body).then((commentsReponse: any) => {
      if (commentsReponse.statusText === 'Created') {
        if (this.isCommnetsPanelOpened)
          this.utils.updateConversationList('TASK');
        else
          this.utils.openOrClosePanel(SidePanel.Comments);
        this.comment = '';
        this.closeOverlay.emit();
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Task added successfully' });
        this.uploadedFiles = [];
        this.utils.toggleTaskAssign(true);
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: commentsReponse?.data?.common?.status });
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  onChangeComment(): void {
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
        }
      }
    }

  }
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.files.push(item);
    }
    this.readFileContent(this.files[0]);

  }
  deleteFile(index: number) {
    console.log(index, '0000000')
    this.files.splice(index, 1);
    this.closeOverlay.emit(false);

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
        this.uploadedFiles.push(res.data.filePath);
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
}
