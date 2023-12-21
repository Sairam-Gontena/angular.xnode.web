import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/models/comment';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';

@Component({
  selector: 'xnode-comments-tabs',
  templateUrl: './comments-tabs.component.html',
  styleUrls: ['./comments-tabs.component.scss']
})

export class CommentsTabsComponent implements OnInit {
  list: Array<Comment> = [];
  @Input() usersList: any;
  @Input() swaggerData:any;
  activeIndex: number = 0;
  tabTypes: Array<string> = ['Comments', 'Tasks'];
  constructor(public specUtils: SpecUtilsService) {
    this.specUtils.tabToActive.subscribe((event: any) => {
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
  }
}
