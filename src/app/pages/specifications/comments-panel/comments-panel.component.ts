import { Component, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from '../../../components/services/utils.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { CommentsService } from 'src/app/api/comments.service';
import { Comment } from 'src/models/comment';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { AuditInfo } from 'src/models/audit-info';

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


  constructor(private utils: UtilsService, private commentsService: CommentsService) {
    this.utils.getMeSelectedSection.subscribe((event: any) => {
      this.selectedSection = event;
    })
  }

  ngOnInit(): void {
    let data = localStorage.getItem("currentUser")
    if (data) {
      this.currentUser = JSON.parse(data);
      this.username = this.currentUser.first_name.toUpperCase() + ' ' + this.currentUser.last_name.toUpperCase();
      if (this.currentUser.first_name && this.currentUser.last_name) {
        this.userImage = this.currentUser.first_name.charAt(0).toUpperCase() + this.currentUser.last_name.charAt(0).toUpperCase();
      }
    }
  }

  setAvatar(userObj: AuditInfo): string {
    let avatar: string = '';
    if (userObj.ModifiedBy?.DisplayName) {
      avatar = userObj.ModifiedBy?.DisplayName.charAt(0).toUpperCase()
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
  }
  editComment(index: number): void {
    this.selectedIndex = index
  }
  deleteCurrentComment(comment: string): void {
    this.enableDeletePrompt = true
  }
  handleConfirmationPrompt(event: boolean): void {
    this.enableDeletePrompt = event
  }
}
