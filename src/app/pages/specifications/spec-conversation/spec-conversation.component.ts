import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilsService } from '../../../components/services/utils.service';
import { CommentsService } from '../../../api/comments.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Comment } from 'src/models/comment';
import { MessagingService } from '../../../components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';

@Component({
  selector: 'xnode-spec-conversation',
  templateUrl: './spec-conversation.component.html',
  styleUrls: ['./spec-conversation.component.scss']
})
export class SpecConversationComponent {
  @Input() list: any;
  @Input() usersList: any;
  @Input() topParentId: any;
  @Input() activeIndex: any;
  @Output() onClickClose = new EventEmitter<any>();
  comment: any;
  currentUser: any;
  selectedSection: any;
  showNewCrPopup: boolean = false;
  selectedComment: any;
  showCommentInput: boolean = false;
  openEditComment: boolean = false;
  selectedIndex?: number;
  showDeletePopup: boolean = false;
  action?: string;
  showCrPopup: boolean = false;
  usersData: any;
  users: any = [];
  originalBackgroundColor: string = 'blue';
  showReplies: boolean = false;
  replies: any;
  specListCopy: any;
  specList: any[] = [];

  constructor(private utils: UtilsService,
    private commentsService: CommentsService,
    private sanitizer: DomSanitizer,
    private messagingService: MessagingService) {
    this.utils.getMeLatestComments.subscribe((event: any) => {
      if (event === 'reply') {
        // this.viewReplies(this.selectedComment);
        this.showCommentInput = false;
        this.action = ''
      }
    })
  }

  ngOnInit() {
    if(this.list?.[0]?.parentEntity=="COMMENT"){
      this.specListCopy = this.list;
      this.specList = this.list.slice(0, 2);
    }else{
      this.specList = this.list;
    }
  }

  loadComments(change:string) {
    if(change==='increment'){
      const startIndex = this.specList.length;
      const endIndex = Math.min(startIndex + 2, this.specListCopy.length);
      const newItems  = this.specListCopy.slice(startIndex, endIndex);
      this.specList.push(...newItems);
    }else{
      this.specList = this.specListCopy.slice(0, 2);
    }
  }

  setAvatar(userObj: any): string {
    let avatar: string = '';
    if (userObj.createdBy && userObj.createdBy?.displayName) {
      avatar = userObj.createdBy.firstName.charAt(0).toUpperCase() + userObj.createdBy.lastName.charAt(0).toUpperCase();
    } else if (userObj.assignee && userObj.assignee?.displayName) {
      avatar = userObj.assignee.firstName.charAt(0).toUpperCase() + userObj.assignee.lastName.charAt(0).toUpperCase();
    } else {
      avatar = '';
    }
    return avatar;
  }

  eventFromConversationAction(data: { action: string, cmt: any }) {
    if (data.action === 'REPLY') {
      this.onClickReply(data.cmt);
    } if (data.action === 'EDIT') {
      this.editComment(data.cmt);
    } if (data.action === 'LINK_TO_CR') {
      this.linkToCr(data.cmt);
    } if (data.action === 'DELETE') {
      this.deleteCurrentComment(data.cmt);
    }
  }

  onClickReply(cmt: any): void {
    if (!cmt.topParentId) {
      this.topParentId = cmt.id
    }
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
    this.showDeletePopup = true
  }

  toggleConfirmPopup(event: boolean) {
    this.showDeletePopup = event
  }

  handleDeleteConfirmation(event: boolean): void {
    if (this.activeIndex == 0) {
      this.deleteComment(event)
    } else if (this.activeIndex == 1) {
      this.deleteTask(event)
    }
  }

  deleteComment(event: boolean) {
    this.utils.loadSpinner(true);
    this.showDeletePopup = event;
    this.commentsService.deletComment(this.selectedComment.id).then(res => {
      if (res) {
        this.utils.loadToaster({ severity: 'success', summary: 'Success', detail: 'Comment deleted successfully' });
        this.utils.updateCommnetsList('comment');
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
      this.utils.loadSpinner(false);
    })
  }

  deleteTask(event: boolean) {
    this.utils.loadSpinner(true);
    this.showDeletePopup = event;
    this.commentsService.deletTask(this.selectedComment.id).then(res => {
      if (res) {
        this.utils.loadToaster({ severity: 'success', summary: 'Success', detail: 'Task deleted successfully' });
        this.utils.updateCommnetsList('task');
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
  modifiedTimeDifference(modifiedOn: Date): string {
    const now = new Date();
    const modifiedTime = new Date(modifiedOn);
    const timeDifference = now.getTime() - modifiedTime.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    if (minutesDifference < 1) {
      return 'Just now';
    } else if (minutesDifference === 1) {
      return '1m ago';
    } else if (minutesDifference < 60) {
      return `${minutesDifference}m ago`;
    } else {
      const hoursDifference = Math.floor(minutesDifference / 60);
      if (hoursDifference === 1) {
        return '1h ago';
      } else {
        return `${hoursDifference}h ago`;
      }
    }
  }

  viewReplies(cmt?: any) {
    if (!cmt.topParentId || cmt.topParentId !== null) {
      this.topParentId = cmt.id;
    }
    this.showReplies = true;
    if (cmt)
      this.selectedComment = cmt;
    this.utils.loadSpinner(true);
    this.commentsService.getComments({ topParentId: this.selectedComment.id }).then((response: any) => {
      if (response && response.data) {
        this.replies = response.data;
        response.data.forEach((element: any) => {
          element.parentUser = this.list.filter((ele: any) => { return ele.id === this.selectedComment.id })[0].createdBy;
        });
        this.list.forEach((obj: any) => {
          if (obj.id === this.selectedComment.id) {
            obj.comments = response.data;
            obj.repliesOpened = true
          }
        })
        this.replies = response.data;
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

  hideReplies(cmt?: any) {
    this.list.forEach((obj: any) => {
      if (obj.id === this.selectedComment.id) {
        obj.comments = this.replies;
        obj.repliesOpened = false
      }
    })
  }


  linkToCr(cmt?: any) {
    console.log('cmt', cmt);
    
    if (cmt) {
      this.selectedComment = cmt;
      this.showCrPopup = true;
      this.messagingService.sendMessage({
        msgType: MessageTypes.LinkToCR,
        msgData: cmt
      });
    }

  }

}
