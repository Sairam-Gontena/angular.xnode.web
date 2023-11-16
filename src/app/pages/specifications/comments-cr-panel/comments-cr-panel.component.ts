import { Component, Input, OnInit, Output } from '@angular/core';
import { SidePanel } from 'src/models/side-panel.enum';
import { CommentsService } from 'src/app/api/comments.service';
import { Comment } from 'src/models/comment';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-comments-cr-panel',
  templateUrl: './comments-cr-panel.component.html',
  styleUrls: ['./comments-cr-panel.component.scss']
})
export class CommentsCrPanelComponent implements OnInit {
  @Input() specData?: Array<[]>;
  @Input() usersList: any;
  userImage?: any = "DC";
  username?: any;
  filterOptions: Array<DropdownOptions> = [{ label: 'All Comments', value: 'all' }];
  selectedFilter: string = 'All Comments';
  @Input() list: Array<Comment> = [];
  commentObj: any = {
    comment: '',
    role: '',
    user_id: ''
  };
  comment: any;
  currentUser: any;
  selectedSection: any;

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
    this.list.push(this.commentObj);
  }
}
