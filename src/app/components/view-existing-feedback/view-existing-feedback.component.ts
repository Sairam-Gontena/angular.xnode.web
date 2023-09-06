import { Component, HostListener, Input, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { UserUtilsService } from 'src/app/api/user-utils.service';

@Component({
  selector: 'xnode-view-existing-feedback',
  templateUrl: './view-existing-feedback.component.html',
  styleUrls: ['./view-existing-feedback.component.scss']
})
export class ViewExistingFeedbackComponent implements OnInit {
  @Input() visible: any;
  public getScreenWidth: any;
  public dialogWidth: string = '80vw';
  areaTypes: any[] = [{ label: 'Reported Bug', value: 'RP' }, { label: 'General Feedback', value: 'GF' }];
  selectedArea: any;
  feedbackList: any;


  constructor(public utils: UtilsService, private userUtils: UserUtilsService) {
    this.onWindowResize();
  }

  @HostListener('window:resize', ['$event'])

  ngOnInit(): void {
    this.utils.loadSpinner(true);
    this.getMeFeedbackList();
  }

  getMeFeedbackList(): void {
    this.userUtils.get('/user-bug-report').then(res => {
      console.log('res', res);
      if (res && res.data)
        this.feedbackList = res.data;
      this.utils.loadSpinner(false);
    }).catch(err => {
      this.utils.loadSpinner(false);
    })
  }

  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 780) {
      this.dialogWidth = '100vw';
    } else if (this.getScreenWidth > 780 && this.getScreenWidth < 980) {
      this.dialogWidth = '80vw';
    } else if (this.getScreenWidth > 980) {
      this.dialogWidth = '80vw';
    }
  }

  closePopup() {
    this.utils.showFeedbackPopupByType('');
  }

}
