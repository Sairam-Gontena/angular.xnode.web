import { Component } from '@angular/core';

@Component({
  selector: 'xnode-specifications-content',
  templateUrl: './specifications-content.component.html',
  styleUrls: ['./specifications-content.component.scss']
})

export class SpecificationsContentComponent {
  showMoreContent?: boolean = false;
  onClickSeeMore(): void {
    this.showMoreContent = !this.showMoreContent;
  }
}
