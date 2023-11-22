import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Comment } from 'src/models/comment';
import { UtilsService } from 'src/app/components/services/utils.service';
import { CommentsService } from 'src/app/api/comments.service';
import { SidePanel } from 'src/models/side-panel.enum';

@Component({
  selector: 'xnode-comments-tabs',
  templateUrl: './comments-tabs.component.html',
  styleUrls: ['./comments-tabs.component.scss']
})

export class CommentsTabsComponent implements OnInit {
  list: Array<Comment> = [];
  @Input() usersList: any;
  activeIndex: number = 0;
  tabTypes: Array<string> = ['Comments', 'Tasks'];
  constructor(public utils: UtilsService) {
    this.utils.getMeLatestConversation.subscribe((event: any) => {
      if (event === 'COMMENT') {
        this.activeIndex = 0;
      } else if (event === 'TASK') {
        this.activeIndex = 1;
      }
    })
  }

  ngOnInit(): void {

  }

  onTabChange(event: any) {
    this.activeIndex = event.index;
    if (event.index === 0)
      this.utils.updateConversationList('COMMENT');
    else
      this.utils.updateConversationList('TASK');
  }
}
