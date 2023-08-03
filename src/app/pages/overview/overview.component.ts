import { Component, Input } from '@angular/core';
import *as data from '../../constants/overview.json';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
@Component({
  selector: 'xnode-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [MessageService]
})

export class OverViewComponent {
  @Input() currentStep: number = 2;
  loading: boolean = true;
  templates: any;
  appName = localStorage.getItem("app_name");
  highlightedIndex: string | null = null;
  iconClicked: any;
  stepper: any;
  show = false;
  counter: any = 1;
  counter2: any = 1;
  jsondata: any;
  childData: any;
  currentUser?: User;
  overview: any;
  id: String = '';
  email = '';
  features: any;
  createOn: any;

  constructor(private apiService: ApiService, private messageService: MessageService, private utilService: UtilsService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.jsondata = data?.data;
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ]
    if (this.currentUser?.email)
      this.email = this.currentUser?.email;
    this.get_ID();
  };

  emitIconClicked(icon: string) {
    if (this.highlightedIndex === icon) {
      this.highlightedIndex = null;
    } else {
      this.highlightedIndex = icon;
    }
    this.iconClicked.emit(icon);
  }

  // showToast(severity: string, message: string, code: string) {
  // this.messageService.clear();
  // this.messageService.add({ severity: severity, summary: code, detail: message, sticky: true });
  // }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
    this.counter++;
  }

  prevStep(): void {
    this.stepper.prevStep();
    this.counter--;
  }

  setStep(step: any) {
    this.counter = step;
  }

  nextStep2() {
    this.stepper.nextStep();
    this.counter2++;
  }

  prevStep2() {
    this.stepper.prevStep();
    this.counter2--;
  }

  setStep2(step: any) {
    this.counter2 = step;
  }

  get_ID() {
    this.apiService.get('/get_metadata/' + this.email)
      .then(response => {
        this.id = response.data.data[0].id;
        this.getMeOverview();
      }).catch(error => {
        console.log(error);
        // this.showToast('error', error.message, error.code);
        // this.loading = false;
        this.utilService.endSpinnerInApp('severity', error.message, error.code);
      });
  }

  getMeProductId() {
    return !localStorage.getItem('record_id') ? this.id : localStorage.getItem('record_id');
  }

  getMeOverview() {
    this.apiService.get("/retrive_overview/" + this.currentUser?.email + "/" + this.getMeProductId())
      .then(response => {
        if (response?.status === 200) {
          this.overview = response.data;
          this.features = response.data?.Features;
          this.appName = response?.data?.title;
          this.createOn = response?.data?.created_on;
          localStorage.setItem("app_name", response?.data?.Title);
        }
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
        this.utilService.endSpinnerInApp('severity', error.message, error.code);
        // this.showToast('error', error.message, error.code);
        // this.loading = false;
      });

  }
}

