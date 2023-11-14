import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import * as _ from "lodash";
import { SidePanel } from 'src/models/side-panel.enum';
import { MentionConfig } from 'angular-mentions';
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
  @Input() comment: string = '';
  @Input() specItem: any;
  @Input() parentEntity: any;
  @Input() parentId: any;
  @Input() topParentId: any;
  @Input() commentType: string = '';
  @Input() selectedComment: any;
  @Input() action: any;
  @Input() selectedText: any;
  @Input() specId: any;
  assinedUsers: string[] = [];
  assignAsaTask: boolean = false;
  currentUser: any;
  product: any;
  listToMention: any;
  config: MentionConfig = {};
  references: any;

  constructor(public utils: UtilsService,
    private commentsService: CommentsService) {
    this.references = [];
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
    let data = [] as any[];
    if (this.users) {
      this.users.forEach((element: any) => {
        element.name = element?.first_name + " " + element?.last_name;
      });
    }
    this.config = {
      labelKey: 'name',
      mentionSelect: this.format.bind(this),
    };
  }

  format(item: any) {
    let outputObject: Record<string, any> = {};
    outputObject[item.user_id] = item.first_name + " " + item.last_name;
    this.references = outputObject;
    return `@${item.first_name} ${item.last_name},`
  }

  onClickSend(): void {
    let referenceContentObject;
    if (this.selectedText) {
      referenceContentObject = {
        'title': this.selectedContent?.title,
        'content': this.selectedContent?.content,
        'commentedtext': this.selectedText
      }
      this.commentType = 'comment';
    } else {
      referenceContentObject = {
        'title': this.selectedContent?.title,
        'content': this.selectedContent?.content
      }
    }
    let body;
    if (this.action === 'EDIT') {
      this.selectedComment.message = this.comment;
      body = this.selectedComment;
    } else {
      body = {
        "createdBy": this.currentUser.user_id,
        "topParentId": this.topParentId, // For new comment it is 'null' and reply level this should be top comment id.
        "parentEntity": this.parentEntity,
        "parentId": this.parentId, // It should be spec id at New comment level and parent commment id at reply level
        "message": this.comment,
        "referenceContent": this.parentEntity === 'SPEC' ? referenceContentObject : {},
        "attachments": [
        ],
        "references": { Users: this.references },
        "followers": [
        ],
        "feedback": {}
      }
    }
    this.saveComment(body);
  }

  saveComment(body: any): void {
    this.commentsService.addComments(body).then((commentsReponse: any) => {
      if (commentsReponse.statusText === 'Created') {
        this.utils.updateCommnetsList(this.commentType);
        this.utils.openOrClosePanel(SidePanel.Comments);
        this.comment = '';
        this.closeOverlay.emit();
        let detail = 'Comment added successfully'
        if (this.action == 'EDIT') {
          detail = 'Comment edited successfully'
        }
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail });
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: commentsReponse?.data?.common?.status });
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
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
