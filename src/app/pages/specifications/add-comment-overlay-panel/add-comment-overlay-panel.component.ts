import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
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
  comment: string = '';
  users: string[] = ["Noah", "Liam", "Mason"];
  assinedUsers: string[] = [];
  assignAsaTask: boolean = false;
  currentUser: any;
  product: any;

  constructor(public utils: UtilsService,
    private commentsService: CommentsService,) {

  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
    }
  }

  onClickSend(): void {
    this.utils.loadSpinner(true);
    const body = {
      contentId: this.selectedContent.id,
      productId: this.product.id,
      userId: this.currentUser.user_id,
      message: this.comment,
      itemType: 'Comment',
    }
    this.commentsService.addComments(body)
      .then((commentsReponse: any) => {
        this.utils.commentAdded(true);
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
