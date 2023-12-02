import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { CommonApiService } from 'src/app/api/common-api.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-conversation-actions',
  templateUrl: './conversation-actions.component.html',
  styleUrls: ['./conversation-actions.component.scss'],
})
export class ConversationActionsComponent {
  @Input() cmt: any;
  @Input() activeIndex: any;
  @Output() updateAction = new EventEmitter<{ action: string; cmt: any }>();
  files: any[] = [];
  uploadedFiles: any = [];
  selectedComment: any;

  constructor(
    public utils: UtilsService,
    private commentsService: CommentsService,
    private commonApi: CommonApiService,
    private specUtils: SpecUtilsService
  ) { }
  onClickReply(cmt: any): void {
    this.updateAction.emit({
      action: 'REPLY',
      cmt: cmt,
    });
  }

  editComment(cmt: any): void {
    this.updateAction.emit({
      action: 'EDIT',
      cmt: cmt,
    });
  }

  linkToCr(cmt: any): void {
    this.updateAction.emit({
      action: 'LINK_TO_CR',
      cmt: cmt,
    });
  }

  unLinkToCr(cmt: any): void {
    this.updateAction.emit({
      action: 'UNLINK_CR',
      cmt: cmt,
    });
  }

  archiveComment(cmt: any): void {
    this.updateAction.emit({
      action: 'ARCHIVE',
      cmt: cmt,
    });
  }
  fileBrowseHandler(event: any, cmt: any) {
    this.selectedComment = cmt;
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
      const res = await this.commonApi.postFile('file-azure/upload', formData, {
        headers,
      });
      if (res.statusText === 'Created') {
        // this.uploadedFiles.push(res.data.id);
        this.uploadedFiles.push({
          fileId: res.data.id,
          fileName: res.data.fileName,
        });
        if (this.activeIndex === 0) {
          this.saveComment();
        } else if (this.activeIndex === 1) {
          this.saveAsTask();
        }
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

  saveComment(): void {
    let cmt = this.selectedComment;
    const concatenatedFiles = [...this.uploadedFiles, ...(cmt.attachments || [])];

    cmt.attachments = concatenatedFiles.map(file => file.fileId);

    this.commentsService.addComments(cmt).then((commentsReponse: any) => {
      if (commentsReponse.statusText === 'Created') {
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'File Updated successfully' });
        this.specUtils._tabToActive('COMMENT');
        this.uploadedFiles = [];
      } else {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  saveAsTask(): void {
    let cmt = this.selectedComment;
    cmt.assignee = cmt.assignee.userId;

    const concatenatedFiles = [...this.uploadedFiles, ...(cmt.attachments || [])];

    cmt.attachments = concatenatedFiles.map((file) => file.fileId);
    cmt.deadline = '';
    this.commentsService
      .addTask(cmt)
      .then((commentsReponse: any) => {
        if (commentsReponse.statusText === 'Created') {
          this.utils.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: 'File updated successfully',
          });
          this.specUtils._tabToActive('TASK');
          this.uploadedFiles = [];
          this.utils.loadSpinner(false);
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: commentsReponse?.data?.common?.status,
          });
        }
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
