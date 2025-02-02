import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { UtilsService } from '../services/utils.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OverallSummary } from 'src/models/view-summary';
import { ClipboardService } from 'ngx-clipboard';
import { MessageTypes } from 'src/models/message-types.enum';
import { ConversationHubService } from 'src/app/api/conversation-hub.service';

@Component({
  selector: 'xnode-view-summary-popup',
  templateUrl: './view-summary-popup.component.html',
  styleUrls: ['./view-summary-popup.component.scss']
})
export class ViewSummaryPopupComponent implements OnInit, OnChanges {
  @Input() conversationID: any;
  @Input() visible: any;
  @Input() notifObj: any;
  @Input() label: any;
  @Input() convSummary?: OverallSummary;
  @Output() closeSummaryPopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closePopUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedTab: string = 'summary';
  activeIndex = 0;
  isCopyIconClicked: boolean = false
  tabs = [
    {
      name: 'Summary',
      key: 1,
      active: true
    },
    {
      name: 'History',
      key: 4,
      active: false
    }
  ];
  currentUser: any = ''

  constructor(private datePipe: DatePipe, private conversationService: ConversationHubService, private utils: UtilsService, private router: Router,
    private clipboardService: ClipboardService, private messagingService: MessagingService) {
  }

  ngOnInit(): void {
    this.label == 'View in Chat' ? this.label = 'View in Chat' : this.label = 'Close';
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
  }

  onClickTab(index: number) {
    this.activeIndex = index;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notifObj']?.currentValue) {
      this.utils.loadLoginUser(true)
    }
  }

  getMeLocalDateAndTime(date: any) {
    const utcDate = new Date(date);
    const offset = utcDate.getTimezoneOffset();
    const localDate = new Date(utcDate.getTime() - (offset * 60 * 1000));
    return this.datePipe.transform(localDate, "MMM dd, yyyy 'at' hh:mm a");
  }

  onClickViewSummary(): void {
    if (!window.location.hash.includes('#/x-piot')) {
      const queryParams = {
        productId: this.notifObj.product_id,
        entity: this.notifObj.entity,
      };
      this.router.navigate(['/x-pilot'], { queryParams });
    } else {
    }
  }
  viewChatSummary() {
    if (this.label == 'View in Chat') {

      this.getConversation();
    }
    this.closePopup();
  }

  getConversation(): void {
    this.utils.loadSpinner(true);
    this.conversationService.getConversations('?id=' + this.notifObj.conversationId + '&fieldsRequired=id,title,conversationType,content').then((res: any) => {
      if (res && res.status === 200) {
        this.messagingService.sendMessage({
          msgType: MessageTypes.VIEW_SUMMARY,
          msgData: { conversationDetails: res.data?.data[0] },
        });
      }
      this.utils.loadSpinner(false);
    }).catch(((err: any) => {
      this.utils.loadSpinner(false);
    }))
  }

  async copyToClipboard(content: any, event: any) {
    let formattedContent = ''
    if (typeof content === 'string') {
      formattedContent = content;
    } else {
      const summary = content?.Summary ?? content?.summary ?? content;
      const KeyPoints = content?.KeyPoints ?? content?.keypoints ?? '';
      const Actions = content?.Actions ?? content?.actions ?? '';
      const Participants = content?.Participants ?? content?.participants ?? '';
      const Tags = content?.Tags ?? content?.tags ?? '';
      formattedContent = `Summary \n\n${summary}\n\nKey Points \n${await this.convertListToStringCount(KeyPoints)}\n\nActions \n${await this.convertListToStringCount(Actions)}\n\nParticipants \n${await this.convertListToString(Participants)}\n\nTags \n${await this.convertListToString(Tags)}`;
    }
    this.clipboardService.copyFromContent(formattedContent);
    this.isCopyIconClicked = true
    setTimeout(() => {
      this.isCopyIconClicked = false
    }, 2000);
    event.stopPropagation();
  }
  async convertListToStringCount(data: any): Promise<string> {
    let string = '';
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      string += '  ' + (index + 1) + '. ' + item + '\n';
    }
    return string;
  }


  async sendOnMail(content: any, event: any): Promise<void> {
    const subject = content.Title ? content.Title : content?.title ? content?.title : '';
    let formattedContent = ''
    if (typeof content === 'string') {
      formattedContent = content;
    } else {
      const summary = content?.Summary ?? content?.summary ?? content;
      const KeyPoints = content?.KeyPoints ?? content?.keypoints ?? '';
      const Actions = content?.Actions ?? content?.actions ?? '';
      const Participants = content?.Participants ?? content?.participants ?? '';
      const Tags = content?.Tags ?? content?.tags ?? '';
      formattedContent = `Summary \n\n${summary}\n\nKey Points \n${await this.convertListToStringCount(KeyPoints)}\n\nActions \n${await this.convertListToStringCount(Actions)}\n\nParticipants \n${await this.convertListToString(Participants)}\n\nTags \n${await this.convertListToString(Tags)}`;
    }
    if (formattedContent.length > 2048) {
      formattedContent = "The text content exceeds 2048 characters. Please copy and paste the text manually"
    }
    const encodedContent = encodeURIComponent(formattedContent);
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodedContent}`;
    window.open(mailtoLink, '_blank');
    event.stopPropagation();
  }


  async convertListToString(data: any): Promise<string> {
    let string = '';
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      string += item + (index === data.length - 1 ? '' : ', ');
    }
    return string;
  }
  closePopup(): void {
    this.closePopUp.emit();
    this.activeIndex = 0;
  }
}
