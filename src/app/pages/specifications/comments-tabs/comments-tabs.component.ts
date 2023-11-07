import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/models/comment';

@Component({
  selector: 'xnode-comments-tabs',
  templateUrl: './comments-tabs.component.html',
  styleUrls: ['./comments-tabs.component.scss']
})
export class CommentsTabsComponent implements OnInit {
  @Input() commentList: Array<Comment> = [];
  ngOnInit(): void {
  }
}
