import { Component, Input } from '@angular/core';

@Component({
  selector: 'xnode-no-comments',
  templateUrl: './no-comments.component.html',
  styleUrls: ['./no-comments.component.scss']
})
export class NoCommentsComponent {
  @Input() content: string = '';

}
