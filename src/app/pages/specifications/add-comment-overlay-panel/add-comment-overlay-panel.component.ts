import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { ApiService } from 'src/app/api/api.service';
import * as _ from "lodash";
import { SidePanel } from 'src/models/side-panel.enum';
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
  @Input() comment: string = ''
  assinedUsers: string[] = [];
  assignAsaTask: boolean = false;
  currentUser: any;
  product: any;
  usersData: any;
  constructor(public utils: UtilsService,
    private commentsService: CommentsService,
    private api: ApiService) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
    }
  }
  ngOnInit(): void {

  }
  onClickSend(): void {
    this.utils.loadSpinner(true);
    const mentionedUsers = this.comment.split(/[@ ]/);
    let users: { userId: any; displayName: any; email: any; }[] = [];
    this.usersData.forEach((elem: any) => {
      mentionedUsers.some((user: any) => {
        let nameArray: any;
        if (elem?.first_name.includes(" ")) {
          nameArray = elem?.first_name.split(" ");
        }
        if (user.toLowerCase() == elem?.first_name.toLowerCase() || nameArray?.some((name: any) => name === user)) {
          let data = {
            "userId": elem?.user_id,
            "displayName": elem?.first_name + elem?.last_name,
            "email": elem?.email
          }
          users.push(data)
        }
      })
    });
    const uniqueData = _.uniqWith(users, (a, b) => a.userId === b.userId);
    const body = {
      contentId: this.selectedContent.id,
      productId: this.product.id,
      userId: this.currentUser.user_id,
      message: this.comment,
      itemType: 'Comment',
      userMentions: uniqueData
    }
    this.commentsService.addComments(body).then((commentsReponse: any) => {
      this.utils.commentAdded(true);
      this.utils.openOrClosePanel(SidePanel.Comments);
      this.comment = '';
      this.utils.loadSpinner(false);
      this.closeOverlay.emit()
    }).catch(err => {
      console.log('err', err);
      this.utils.loadSpinner(false);
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
