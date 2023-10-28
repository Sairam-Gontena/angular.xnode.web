import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { CommentsService } from 'src/app/api/comments.service';
import { Comment } from 'src/models/comment';
import { SpecContent } from 'src/models/spec-content';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { COMMENTS } from 'src/app/pages/specifications/mock';

@Component({
  selector: 'xnode-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss']
})
export class CommentsPanelComponent implements OnInit {
  @Input() specData?: Array<[]>
  userImage?: any = "DC";
  username?: any;
  filterOptions: Array<DropdownOptions> = [{ label: 'All Comments', value: 'all' }];
  selectedFilter: string = 'All Comments';
  commentList: Array<Comment> = COMMENTS;
  commentObj: any = {
    comment: '',
    role: '',
    user_id: ''
  };
  comment: any;
  currentUser: any;
  selectedSection: any;

  private _contentData: any;
  @Input()
  set contentData(contentData: SpecContent) {
    this._contentData = contentData;
    if (this._contentData) {



      this.getLatestComments();
    }
  }

  get contentData(): any {
    return this._contentData;
  }

  constructor(private utils: UtilsService, private commentsService: CommentsService) {
    this.utils.getMeSelectedSection.subscribe((event: any) => {
      this.selectedSection = event;
    })
  }

  ngOnInit(): void {
    console.log('this._contentData', this._contentData);
    console.log('spec', this.specData);
    let data = localStorage.getItem("currentUser")
    if (data) {
      this.currentUser = JSON.parse(data);
      this.username = this.currentUser.first_name.toUpperCase() + ' ' + this.currentUser.last_name.toUpperCase();
      if (this.currentUser.first_name && this.currentUser.last_name) {
        this.userImage = this.currentUser.first_name.charAt(0).toUpperCase() + this.currentUser.last_name.charAt(0).toUpperCase();
      }
    }
    this.getMeTheContent();

  }

  getLatestComments() {
    this.commentsService.getComments(this.contentData).then((response: any) => {
      if (response && response.data && response.data.comments && response.data.comments.length) {
        this.commentList = COMMENTS;
        this.getMeTheContent();
      } else {
        this.commentList = [];
      }
    }).catch(err => {
      console.log(err);
      this.commentList = [];
    });
    this.commentList = COMMENTS;
    this.getMeTheContent();


  }


  getMeTheContent(): void {
    this.commentList.forEach((obj: Comment) => {
      this.specData?.forEach((specObj: any) => {
        specObj?.content?.forEach((sec: any) => {
          if (obj.content_id === sec.id) {
            console.log('>>>>>>>>>>>>>>>>>>>>>>');
            
            obj.content = sec;
          }
        })
      })
    });
    console.log('this.commentList', this.commentList);

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
}
