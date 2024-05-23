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
      } else if (hoursDifference < 24) {
        return `${hoursDifference}h ago`;
      }

      const daysDifference = Math.floor(hoursDifference / 24);
      if (daysDifference === 1) {
        return '1 day ago';
      } else if (daysDifference < 7) {
        return `${daysDifference} days ago`;
      }

      const weeksDifference = Math.floor(daysDifference / 7);
      if (weeksDifference === 1) {
        return '1 week ago';
      } else if (weeksDifference < 4) {
        return `${weeksDifference} weeks ago`;
      } else {
        return modifiedTime.toLocaleDateString();
      }
    }
  }

  onClickShortId(record: any): void {
    this.recentActivityEvent.emit(record)
  }

}
