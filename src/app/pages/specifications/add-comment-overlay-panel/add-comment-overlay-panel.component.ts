import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from 'src/app/components/services/utils.service';
import { User } from 'src/models/user';
@Component({
  selector: 'xnode-add-comment-overlay-panel',
  templateUrl: './add-comment-overlay-panel.component.html',
  styleUrls: ['./add-comment-overlay-panel.component.scss']
})
export class AddCommentOverlayPanelComponent implements OnInit {
  @Input() usersList: Array<User> = []
  @Output() sendComment = new EventEmitter<string>();
  comment: string = '';
  users: string[] = ["Noah", "Liam", "Mason"];
  assinedUsers: string[] = [];
  assignAsaTask: boolean = false;

  constructor(public utils: UtilsService) {
  }

  ngOnInit(): void {
    this.usersList.forEach(element => {
      element.fullName = element.prospect_info?.first_name + " " + element.prospect_info?.last_name
    });
  }

  onClickSend(): void {
    this.sendComment.emit(this.comment);
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
