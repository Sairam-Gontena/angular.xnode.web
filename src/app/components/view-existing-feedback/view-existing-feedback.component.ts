import { Component, HostListener, Input, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { FormGroup } from '@angular/forms';
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
  areaTypes: any[] = [{ label: 'Reported Bug', value: 'REPORT_BUG' }, { label: 'General Feedback', value: 'GENERAL_FEEDBACK' }];
  selectedArea: any;
  formGroup!: FormGroup;
  reportList: any;
  selectedListItem: any;
  selectedIndex: any = 0;
  currentUser: any;
  showMessageBox: boolean = false;

  constructor(public utils: UtilsService, private userUtilService: UserUtilsService) {
    this.onWindowResize();
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    this.selectedArea = 'REPORT_BUG';
    this.utils.loadSpinner(true);
    this.getMeReportedBugList();
  }

  onSelectListItem(report: any, index: Number) {
    this.selectedListItem = report;
    this.selectedIndex = index;
  }
  onChangeArea(event: any) {
    this.utils.loadSpinner(true);
    this.selectedArea = event.value;
    this.selectedIndex = 0;
    if (event.value === 'REPORT_BUG') {
      this.getMeReportedBugList();
    } else {
      this.getMeGeneralFeedbackList()
    }
  }

  getMeReportedBugList(): void {
    this.userUtilService.get('user-bug-report').then((res: any) => {
      if (res) {
        this.reportList = res.data;
        if (res?.data.length) {
          this.selectedListItem = res.data[0]
        }
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data?.detail });
      }
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  getMeGeneralFeedbackList(): void {
    this.userUtilService.get('/user-feedback').then((res: any) => {
      if (res) {
        this.reportList = res.data;
        if (res?.data.length) {
          this.selectedListItem = res.data[0];
        }
      } else {
        this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: res.data?.detail });
      }
      this.utils.loadSpinner(false);
    }).catch((err: any) => {
      this.utils.loadSpinner(false);
      this.utils.loadToaster({ severity: 'error', summary: 'ERROR', detail: err });
    })
  }

  @HostListener('window:resize', ['$event'])

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
