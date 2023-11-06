import { Component, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from '../../../components/services/utils.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { CommentsService } from 'src/app/api/comments.service';
import { Comment } from 'src/models/comment';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { AuditInfo } from 'src/models/audit-info';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'xnode-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss']
})
export class CommentsPanelComponent implements OnInit {
  @Input() specData?: Array<[]>;
  @Input() commentList: any;
  userImage?: any = "DC";
  username?: any;
  filterOptions: Array<DropdownOptions> = [{ label: 'All Comments', value: 'all' }];
  selectedFilter: string = 'All Comments';
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

  usersData: any;
  users: any = [];
  originalBackgroundColor: string = 'blue';

  constructor(private utils: UtilsService, private commentsService: CommentsService,
    private apiservice: ApiService) {
    this.utils.getMeSelectedSection.subscribe((event: any) => {
      this.selectedSection = event;
    });
    let data = localStorage.getItem("currentUser")
    if (data) {
      this.currentUser = JSON.parse(data);
      this.username = this.currentUser.first_name.toUpperCase() + ' ' + this.currentUser.last_name.toUpperCase();
      if (this.currentUser.first_name && this.currentUser.last_name) {
        this.userImage = this.currentUser.first_name.charAt(0).toUpperCase() + this.currentUser.last_name.charAt(0).toUpperCase();
      }
    }
    // this.apiservice.getAuthApi('user/get_all_users?account_id=' + this.currentUser?.account_id).then((resp: any) => {
    //   this.utils.loadSpinner(true);
    //   if (resp?.status === 200) {
    //     this.usersData = resp.data;
    //     this.usersData.map((element: any) => {
    //       let name: string = element?.first_name;
    //       this.users.push(name)
    //     });
    //   } else {
    //     this.utils.loadToaster({ severity: 'error', summary: '', detail: resp.data?.detail });
    //   }
    //   this.utils.loadSpinner(false);
    // }).catch((error) => {
    //   this.utils.loadToaster({ severity: 'error', summary: '', detail: error });
    //   console.error(error);
    // })
  }

  ngOnInit(): void {

  }

  setAvatar(userObj: any): string {
    let avatar: string = '';
    if (userObj.modified_by) {
      avatar = userObj.modified_by.charAt(0).toUpperCase()
    }
    return avatar;
  }

  onClickClose() {
    this.utils.openOrClosePanel(SidePanel.None);
    this.utils.saveSelectedSection(null);
  }

  onClickEnter(event: KeyboardEventInit) {
    if (event.key === 'Enter' && this.comment.trim().length !== 0) {
      this.onClickSend()
    }
  }

  onClickSend() {
    this.commentObj.comment = this.comment;
    this.commentObj.role = 'user';
    this.commentObj.user_id = this.currentUser.id;
    this.commentList.push(this.commentObj);
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
        this.utils.commentAdded(true)
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: err });
      this.utils.loadSpinner(false);
    })
  }
}
