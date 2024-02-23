import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NaviApiService } from 'src/app/api/navi-api.service';
import { UtilsService } from '../services/utils.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'xnode-view-summary-popup',
  templateUrl: './view-summary-popup.component.html',
  styleUrls: ['./view-summary-popup.component.scss']
})
export class ViewSummaryPopupComponent implements OnInit, OnChanges {
  @Input() visible: any;
  @Input() notifObj: any;
  @Input() convSummary: any
  @Output() closeSummaryPopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closePopUp: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private datePipe: DatePipe, private utils: UtilsService) {

  }

  ngOnInit(): void {

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
}
