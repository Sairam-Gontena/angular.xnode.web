import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { ApiService } from 'src/app/api/api.service';
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
  assinedUsers: string[] = [];
  assignAsaTask: boolean = false;
  currentUser: any;
  product: any;
  listToMention: any;
  config: MentionConfig = {};
  references: any;

  constructor(public utils: UtilsService,
    private commentsService: CommentsService,
    private api: ApiService) {
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
    console.log('>>>', this.comment);
    console.log('>>>', this.references);
    console.log('specItem', this.specItem)
    let body = {
      "parentEntity": this.parentEntity,
      "parentId": this.parentId,
      "message": this.comment,
      "referenceContent": this.parentEntity === 'SPEC' ? { title: this.selectedContent.title, content: this.selectedContent.content } : {},
      "attachments": [
      ],
      "references": { Users: this.references },
      "followers": [
      ],
      "feedback": {}
    }
    console.log('body', body);
    // return

    this.saveComment(body);
    return


    this.utils.loadSpinner(true);
    const mentionedUsers = this.comment.split(/[@ ]/);
    let users: { userId: any; displayName: any; email: any; }[] = [];
    this.users.forEach((elem: any) => {
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
    this.saveComment(uniqueData);
  }

  saveComment(body: any): void {
    this.commentsService.addComments(body).then((commentsReponse: any) => {
      console.log('commentsReponse', commentsReponse);
      if (commentsReponse.statusText === 'Created') {
        this.utils._updateCommnetsList(true);
        this.utils.openOrClosePanel(SidePanel.Comments);
        this.comment = '';
        this.closeOverlay.emit();
        this.utils.loadToaster({ severity: 'success', summary: 'SUCCESS', detail: 'Comment added successfully' });
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

  test(obj: any, ele: any): void {
    console.log('@#@#', obj, ele);

  }
}
