import { Component, Input } from '@angular/core';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-specifications-content',
  templateUrl: './specifications-content.component.html',
  styleUrls: ['./specifications-content.component.scss']
})

export class SpecificationsContentComponent {
  @Input() specData: any;

  showMoreContent?: boolean = false;
  selectedSpecItem: any;
  specItemList: any = [];
  selectedSpecItemListTitles: any = [];
  selectedSectionIndex: any;

  constructor(private utils: UtilsService) {
    this.utils.getMeSpecItem.subscribe((event: any) => {
      if (event) {
        console.log('event', event);
        event.forEach((element: any) => {
          if (this.specItemList.length === 0) {
            this.specItemList = element.section;
          } else {
            this.specItemList = this.specItemList.concat(element.section)
          }
        });
        // this.selectedSpecItem = event;
        // if (this.selectedSpecItemListTitles.length === 0) {
        //   this.selectedSpecItemListTitles.push(event?.title);
        //   this.specItemList = event.section;
        // } else {
        //   if (this.selectedSpecItemListTitles.filter((title: any) => { return title === event.title }).length === 0) {
        //     this.selectedSpecItemListTitles.push(event?.title);
        //     this.specItemList = this.specItemList.concat(event.section);

        //   }
        // }
      }
      console.log('specItemList', this.specItemList);
      // console.log('selectedSpecItemListTitles', this.selectedSpecItemListTitles);
      // console.log('selectedSpecItem', this.selectedSpecItem);



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
    console.log(' this.specItemList', this.specItemList);

  }
}
