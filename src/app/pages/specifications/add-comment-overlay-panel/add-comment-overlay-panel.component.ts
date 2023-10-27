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

  constructor(public utils: UtilsService) {

  }

  ngOnInit(): void {

  }

  onClickSend(): void {
    this.sendComment.emit(this.comment);
  }
}
