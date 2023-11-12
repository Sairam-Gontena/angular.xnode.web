import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from '../components/services/utils.service';
import { CommentsService } from '../api/comments.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'xnode-spec-conversation',
  templateUrl: './spec-conversation.component.html',
  styleUrls: ['./spec-conversation.component.scss']
})
export class SpecConversationComponent {
  @Input() list: any;
  @Input() usersList: any;
  @Input() topParentId: any;
  @Output() onClickClose = new EventEmitter<any>();
  comment: any;
  currentUser: any;
  selectedSection: any;
  selectedComment: any;
  showCommentInput: boolean = false;
  openEditComment: boolean = false;
  selectedIndex?: number;
  enableDeletePrompt: boolean = false;
  action?: string;

  usersData: any;
  users: any = [];
  originalBackgroundColor: string = 'blue';

  constructor(private utils: UtilsService,
    private commentsService: CommentsService,
    private sanitizer: DomSanitizer) {
    console.log('topParentId', this.topParentId);
  }

  setAvatar(userObj: any): string {
    let avatar: string = '';
    if (userObj.createdBy && userObj.createdBy?.displayName) {
      avatar = userObj.createdBy.firstName.charAt(0).toUpperCase() + userObj.createdBy.lastName.charAt(0).toUpperCase();
    }
    return avatar;
  }


  onClickReply(cmt: any): void {
    this.selectedComment = cmt;
    this.showCommentInput = true;
    this.action = 'REPLY';
  }

  editComment(cmt: number): void {
    this.selectedComment = cmt;
    this.showCommentInput = true;
    this.action = 'EDIT';
  }

  deleteCurrentComment(comment: string): void {
    this.selectedComment = comment;
    this.enableDeletePrompt = true
  }

  handleConfirmationPrompt(event: boolean): void {
    this.utils.loadSpinner(true);
    this.enableDeletePrompt = event;
    this.commentsService.deletComment(this.selectedComment.id).then(res => {
      if (res) {
        this.utils.loadToaster({ severity: 'success', summary: 'Success', detail: 'Comment deleted successfully' });
        this.utils._updateCommnetsList(true);
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
      this.utils.loadSpinner(false);
    })
  }

  highlightMatch(conversation: string): SafeHtml {
    const regex = /@.*?,/g;
    const highlighted = conversation.replace(regex, (match) => {
      const matchedTextWithoutComma = match.slice(0, -1);
      const spanWithId = `<span class="highlight-tags" style="color:rgb(2, 173, 238);" >${matchedTextWithoutComma}</span>`;
      return spanWithId;
    });
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  viewReplys(cmt?: any) {
    console.log('cmt', cmt);

    if (cmt)
      this.selectedComment = cmt;
    this.utils.loadSpinner(true);
    this.commentsService.getComments({ topParentId: this.selectedComment.id }).then((response: any) => {
      if (response && response.data) {
        response.data.forEach((element: any) => {
          element.parentUser = this.list.filter((ele: any) => { return ele.id === this.selectedComment.id })[0].createdBy;
        });
        this.list.forEach((obj: any) => {
          if (obj.id === this.selectedComment.id) {
            obj.comments = response.data;
          }
        })
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: response.data?.status });
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      console.log(err);
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });

    });
  }

}
