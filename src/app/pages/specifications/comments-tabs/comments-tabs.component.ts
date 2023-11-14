import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Comment } from 'src/models/comment';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-comments-tabs',
  templateUrl: './comments-tabs.component.html',
  styleUrls: ['./comments-tabs.component.scss']
})
export class CommentsTabsComponent implements OnInit {
  @Input() commentList: Array<Comment> = [];
  @Input() tasksList: Array<Comment> = [];
  @Input() usersList: any;
  activeIndex: number = 0;

  constructor(public utils: UtilsService) {
    this.utils.getMeTaskAssigned.subscribe((taskAssigned) => {
      if (taskAssigned) {
        this.activeIndex = 1;
      }
    })
  }



  ngOnInit(): void {
  }
}
