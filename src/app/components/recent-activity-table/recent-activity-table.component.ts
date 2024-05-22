import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';


@Component({
  selector: 'xnode-recent-activity-table',
  templateUrl: './recent-activity-table.component.html',
  styleUrls: ['./recent-activity-table.component.scss']
})
export class RecentActivityTableComponent {
  @Output() recentActivityEvent: EventEmitter<object> = new EventEmitter<object>();
  @Input() dataContent?: any;
  @Input() headers?: any[];
  constructor(
  ) {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataContent']?.currentValue) {
      this.dataContent = changes['dataContent']?.currentValue;
    }
  }
  modifiedTimeDifference(modifiedOn: Date): string {
    const now = new Date();
    const modifiedTime = new Date(modifiedOn);
    const timeDifference = now.getTime() - modifiedTime.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    if (minutesDifference < 1) {
      return 'Just now';
    } else if (minutesDifference === 1) {
      return '1m ago';
    } else if (minutesDifference < 60) {
      return `${minutesDifference}m ago`;
    } else {
      const hoursDifference = Math.floor(minutesDifference / 60);
      if (hoursDifference === 1) {
        return '1h ago';
      } else {
        return `${hoursDifference}h ago`;
      }
    }
  }

  onClickShortId(record: any): void {
    this.recentActivityEvent.emit(record)
  }

}
