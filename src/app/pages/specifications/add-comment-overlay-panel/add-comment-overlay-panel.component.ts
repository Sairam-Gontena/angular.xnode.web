import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UtilsService } from 'src/app/components/services/utils.service';
@Component({
  selector: 'xnode-add-comment-overlay-panel',
  templateUrl: './add-comment-overlay-panel.component.html',
  styleUrls: ['./add-comment-overlay-panel.component.scss']
})
export class AddCommentOverlayPanelComponent implements OnInit {
  @Output() sendComment = new EventEmitter<string>();
  comment: string = '';
  users: string[] = ["Noah", "Liam", "Mason"];
  assinedUsers: string[] = [];
  assignAsaTask: boolean = false;

  constructor(public utils: UtilsService) {

  }

  ngOnInit(): void {

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
