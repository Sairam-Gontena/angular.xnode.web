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
  files: any = [];
  selectedFile: any;

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
  onFileInput(event: Event) {
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      if (files[0].size > maxSizeInBytes) {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: 'File size should not exceed 5mb' });
      } else {
        this.handleFiles(files);
        this.prepareFilesList(files[0]); // Update this line

      }
    }
  }
  private handleFiles(files: FileList) {
    this.readFileContent(files[0], files[0].name);
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const fileName = selectedFile.name;
    if (selectedFile) {
      this.readFileContent(selectedFile, fileName);
    }
    this.prepareFilesList(selectedFile);

  }

  private readFileContent(file: File, fileName: string) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const formData = new FormData();
      formData.append('file', file);
      const headers = { 'Content-Type': 'application/json' };
      this.fileUploadCall(formData, headers);
    };
    reader.readAsArrayBuffer(file);
  }

  fileUploadCall(formData: any, headers: any) {
    this.utils.loadSpinner(true);

    if (!this.isUploading) {
      this.isUploading = true;
      this.commonApi.postFile('file-azure/upload', formData, { headers }).then((res: any) => {
        this.files = res.data;
        console.log('File upload response:', this.files);
        this.isUploading = false;
        this.utils.loadSpinner(false);
      }).catch((error: any) => {
        this.utils.loadSpinner(false);
        console.error('File upload error:', error);
      });
    }
  }
  prepareFilesList(files: File) {
    this.files.push(files);
  }
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }
  // deleteFile() {
  //   if (this.selectedFile) {
  //     this.selectedFile = null;
  //     this.selectedFile = '';
  //   }
  // }
  /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
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
        "attachments": this.files,
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
}
