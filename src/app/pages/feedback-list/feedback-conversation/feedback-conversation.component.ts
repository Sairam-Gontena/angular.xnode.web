import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { UserUtilsService } from 'src/app/api/user-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-feedback-conversation',
  templateUrl: './feedback-conversation.component.html',
  styleUrls: ['./feedback-conversation.component.scss']
})
export class FeedbackConversationComponent {
  @Input() conversation: any;
  @Input() conversationSourceId: any;
  @Input() conversationSourceType: any;
  @Input() index: any;
  showReplyInput: boolean = false;
  selectedConv: any;
  message: any;

  constructor(private userUtilService: UserUtilsService,
    private utils: UtilsService) {

  }

  ngOnChanges(changes: SimpleChange): void {

  }

  getMeUserAvatar() {
    var words = this.conversation.userName.split(" "); // Split the string into an array of words
    if (words.length >= 2) {
      var firstLetterOfFirstWord = words[0][0].toUpperCase(); // Get the first letter of the first word
      var firstLetterOfSecondWord = words[1][0].toUpperCase(); // Get the first letter of the second word
      return firstLetterOfFirstWord + firstLetterOfSecondWord
    }
  }
  onClickReply(obj: any) {
    this.selectedConv = obj;
    this.conversation.showReplyinput = true;
    this.conversation.showReply = false;
  }

  getMeLabel() {
    let btnName: any;
    if (this.conversation?.responses && this.conversation.responses.length > 1) {
      btnName = this.conversation.responses.length + " " + 'Replys'
    }
    if (this.conversation?.responses && this.conversation.responses.length === 1) {
      btnName = this.conversation.responses.length + " " + 'Reply'
    }
    return btnName;
  }

  onClickSeeReplys(): void {
    // Toggle the showReplys property for the clicked conversation
    // obj.showReplys = !obj.showReplys;
    this.conversation.showReply = !this.conversation?.showReply;
    this.conversation.showReplyinput = false;

  }
  onClickSend() {
    this.utils.loadSpinner(true);
    let user = localStorage.getItem('currentUser'); //user_id
    let userId;
    if (user) {
      userId = JSON.parse(user).user_id
    }
    let payload = {
      "userId": userId,
      "conversationSourceType": this.selectedConv.conversationSourceType,
      "conversationSourceId": this.selectedConv.conversationSourceId,
      "message": this.message,
      "parentConversationId": this.selectedConv.id
    }
    this.userUtilService.post(payload, 'user-conversation').then((res: any) => {
      if (res && res?.data) {
        this.utils.reloadList(true);
        this.conversation.showReply = false;
        this.conversation.showReplyinput = false;
      }
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      this.utils.loadToaster({ severity: 'error', summary: '', detail: err });
      this.utils.loadSpinner(false);
    })
  }




}
