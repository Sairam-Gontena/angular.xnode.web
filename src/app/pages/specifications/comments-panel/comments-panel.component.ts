import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { UtilsService } from '../../../components/services/utils.service';
import { CommentsService } from 'src/app/api/comments.service';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';

@Component({
  selector: 'xnode-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss']
})

export class CommentsPanelComponent implements OnInit {
  @Input() specData?: Array<[]>;
  @Input() commenttasksList: any;
  @Input() usersList: any;
  @Input() activeIndex: any;
  userImage?: any = "DC";
  username?: any;
  filterOptions: Array<DropdownOptions> = [{ label: 'All Comments', value: 'all' }];
  selectedFilter: object = { label: 'All Comments', value: 'all' };
  commentObj: any = {
    comment: '',
    role: '',
    user_id: ''
  };
  comment: any;
  currentUser: any;
  selectedSection: any;
  selectedComment: any;
  showCommentInput: boolean = false;
  openEditComment: boolean = false;
  selectedIndex?: number;
  enableDeletePrompt: boolean = false;
  action?: string;
  list: any = [];
  usersData: any;
  users: any = [];
  originalBackgroundColor: string = 'blue';

  constructor(private utils: UtilsService,
    private specUtils: SpecUtilsService, private commentsService: CommentsService,
    private sanitizer: DomSanitizer) {
    this.specUtils.tabToActive.subscribe((res: any) => {
      if (res == 'COMMENT') {
        this.getMeCommentsList();
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const activeIndexChange = changes['activeIndex'] as SimpleChange;
    if (activeIndexChange && activeIndexChange.currentValue === 0) {
      this.getMeCommentsList();
    }
  }

  getMeCommentsList() {
    this.utils.loadSpinner(true);
    let specData = localStorage.getItem('selectedSpec');
    let selectedSpec: any;
    if (specData) {
      selectedSpec = JSON.parse(specData);
      this.commentsService.getComments({ parentId: selectedSpec.id, isReplyCountRequired: true }).then((response: any) => {
        if (response.status === 200 && response.data) {
          this.list = response.data;
        }
        this.utils.loadSpinner(false);
      }).catch(err => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
    }
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
        this.utils.updateConversationList('reply');
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

  viewReplys(cmt: any) {
    this.utils.loadSpinner(true);
    this.commentsService.getComments({ topParentId: cmt.id }).then((response: any) => {
      if (response && response.data) {
        response.data.forEach((element: any) => {
          element.parentUser = this.commenttasksList.filter((ele: any) => { return ele.id === cmt.id })[0].createdBy;
        });
        this.commenttasksList.forEach((obj: any) => {
          if (obj.id === cmt.id) {
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
