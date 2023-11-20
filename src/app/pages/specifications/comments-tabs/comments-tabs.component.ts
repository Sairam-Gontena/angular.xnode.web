import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Comment } from 'src/models/comment';
import { UtilsService } from 'src/app/components/services/utils.service';
import { CommentsService } from 'src/app/api/comments.service';

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

  constructor(public utils: UtilsService,
    private commentsService: CommentsService) {
    this.utils.getMeTaskAssigned.subscribe((taskAssigned) => {
      if (taskAssigned) {
        this.activeIndex = 1;
        this.getMeTasksList();
      }
    })
  }

  ngOnInit(): void {
    this.getMeCommentsList();
  }

  getMeTasksList() {
    this.utils.loadSpinner(true);
    let specData = localStorage.getItem('selectedSpec');
    let selectedSpec: any;
    if (specData) {
      selectedSpec = JSON.parse(specData);
      this.commentsService.getTasks({ parentId: selectedSpec.id }).then((response: any) => {
        if (response && response.data) {
          this.list = response.data;
        }
        this.utils.loadSpinner(false);
      }).catch(err => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
    }
  }

  getMeCommentsList() {
    this.utils.loadSpinner(true);
    let specData = localStorage.getItem('selectedSpec');
    let selectedSpec: any;
    if (specData) {
      selectedSpec = JSON.parse(specData);
      this.commentsService.getComments({ parentId: selectedSpec.id, isReplyCountRequired: true }).then((response: any) => {
        if (response && response.data) {
          this.list = response.data;
        }
        this.utils.loadSpinner(false);
      }).catch(err => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
    }
  }

  onTabChange(event: any) {
    this.activeIndex = event.index;
    if (this.activeIndex === 0) {
      this.getMeCommentsList();
    } else if (this.activeIndex === 1) {
      this.getMeTasksList();
    }
  }
}
