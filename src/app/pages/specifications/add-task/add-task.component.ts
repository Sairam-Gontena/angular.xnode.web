import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CommentsService } from 'src/app/api/comments.service';
import { CommonApiService } from 'src/app/api/common-api.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  providers: [DatePipe]
})
export class AddTaskComponent {
  @Input() visible: boolean = false;
  minDate!: Date;
  selectedDateLabel: any;
  priorityList: any = [
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' },
  ];

  constructor(public utils: UtilsService,
    private commentsService: CommentsService,
    private commonApi: CommonApiService,
    private datePipe: DatePipe,
    private storageService: LocalStorageService,
    private specUtils: SpecUtilsService
  ) {
    this.minDate = new Date();

  }
  onDateSelect(event: any): void {
    const selectedDate: Date = event;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const formattedSelectedDate = this.datePipe.transform(selectedDate, 'shortDate');
    const formattedToday = this.datePipe.transform(today, 'shortDate');
    const formattedTomorrow = this.datePipe.transform(tomorrow, 'shortDate');

    let label: any;

    if (formattedSelectedDate === formattedToday) {
      label = 'Today';
    } else if (formattedSelectedDate === formattedTomorrow) {
      label = 'Tomorrow';
    } else {
      label = formattedSelectedDate;
    }

    this.selectedDateLabel = label;
  }
}
