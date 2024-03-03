import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { UtilsService } from '../services/utils.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OverallSummary } from 'src/models/view-summary';

@Component({
  selector: 'xnode-view-summary-popup',
  templateUrl: './view-summary-popup.component.html',
  styleUrls: ['./view-summary-popup.component.scss']
})
export class ViewSummaryPopupComponent implements OnInit, OnChanges {
  @Input() visible: any;
  @Input() notifObj: any;
  @Input() convSummary?: OverallSummary
  @Output() closeSummaryPopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closePopUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedTab: string = 'summary';
  activeIndex = 0;
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

  constructor(private datePipe: DatePipe, private utils: UtilsService, private router: Router) {

  }

  ngOnInit(): void {
    console.log('convSummary', this.convSummary);

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
  viewChatSummary(){
    if(this.router.url != '/x-pilot'){
    this.router.navigate(['/x-pilot']);
    this.utils.updateSummary(this.notifObj);
    }else{
      this.utils.updateSummary(this.notifObj);
    }
    this.closePopUp.emit();
  }
}