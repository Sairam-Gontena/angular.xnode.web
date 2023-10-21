import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { SidePanel } from 'src/models/side-panel.enum';

@Component({
  selector: 'xnode-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss']
})
export class CommentsPanelComponent implements OnInit {
  userImage?: any;
  username?: any;
  commentList: any = [];
  commentObj: any = {
    comment: '',
    role: '',
    user_id: ''
  };
  comment: any;
  currentUser: any;
  selectedSection: any;

  constructor(private utils: UtilsService) {
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
    console.log('this.comment', this.comment);

    this.commentObj.comment = this.comment;
    this.commentObj.role = 'user';
    this.commentObj.user_id = this.currentUser.id;
    console.log('this.commentObj', this.commentObj);

    this.commentList.push(this.commentObj);
  }
}
