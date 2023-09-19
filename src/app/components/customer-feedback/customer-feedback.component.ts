import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xnode-customer-feedback',
  templateUrl: './customer-feedback.component.html',
  styleUrls: ['./customer-feedback.component.scss']
})

export class CustomerFeedbackComponent implements OnInit {
  public getScreenWidth: any;
  public dialogWidth: string = '40vw';
  modalPosition: any;
  @Input() visible = false;
  @Input() displayReportDialog = false;
  @Output() dataActionEvent = new EventEmitter<any>();
  @HostListener('window:resize', ['$event'])

  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 780) {
      this.modalPosition = 'center';
      this.dialogWidth = '80vw';
    } else if (this.getScreenWidth > 780 && this.getScreenWidth < 980) {
      this.modalPosition = 'center'
      this.dialogWidth = '75vw';
    } else if (this.getScreenWidth > 980) {
      this.modalPosition = 'center'
      this.dialogWidth = '40vw';
    }
  }

  generalFeedbackDialog: boolean = false;

  constructor(public utils: UtilsService,
    public router: Router) {
    this.onWindowResize();
  }

  ngOnInit(): void {

  }

  closePopup() {
    this.utils.showFeedbackPopupByType('');
  }
  onClickViewExistingFeedback(): void {
    this.router.navigate(['/feedback-list']);
    this.utils.showFeedbackPopupByType('');
  }
}
