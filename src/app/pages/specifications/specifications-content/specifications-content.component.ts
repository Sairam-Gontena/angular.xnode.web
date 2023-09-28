import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-specifications-content',
  templateUrl: './specifications-content.component.html',
  styleUrls: ['./specifications-content.component.scss']
})

export class SpecificationsContentComponent {
  @Input() specData: any;
  @ViewChild('contentContainer') contentContainer!: ElementRef;

  showMoreContent?: boolean = false;
  selectedSpecItem: any;
  specItemList: any = [];
  selectedSpecItemListTitles: any = [];
  selectedSectionIndex: any;
  specItemIndex: any;

  constructor(private utils: UtilsService) {
    this.utils.getMeSpecItem.subscribe((event: any) => {
      if (event) {
        event.forEach((element: any) => {
          if (this.specItemList.length === 0) {
            this.specItemList = element.section;
          } else {
            this.specItemList = this.specItemList.concat(element.section)
          }
        });
      }
    })
    this.utils.getMeSpecItemIndex.subscribe((event: any) => {
      if (event) {
        this.specItemIndex = event;
      }
    })
    this.utils.getMeSectionIndex.subscribe((event: any) => {
      if (event) {
        this.scrollToItem(event.title)
      }
    })
  }

  isArray(item: any) {
    return Array.isArray(item?.content);
  }

  onClickSeeMore(item: any, i: any): void {
    this.selectedSectionIndex = i;
    this.showMoreContent = !this.showMoreContent;
    this.specItemList.forEach((obj: any) => {
      if (obj.title === item.title) {
        obj.collapsed = true
      }
    })
  }

  scrollToItem(itemId: string) {
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getMeBanner(event: any) {
    return './assets/' + event.title.toLowerCase().replace(/ /g, '') + '.svg';
  }
}
