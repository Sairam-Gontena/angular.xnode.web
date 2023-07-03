import { Component, Input } from '@angular/core';
import *as data from '../../constants/overview.json';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'xnode-over-view',
  templateUrl: './over-view.component.html',
  styleUrls: ['./over-view.component.scss']
})

export class OverViewComponent {
  @Input() currentStep: number = 2;
  loading: boolean = true;
  templates: any;
  selectedTemplate: string = 'FinBuddy';
  highlightedIndex: string | null = null;
  iconClicked: any;
  stepper: any;
  show = false;
  counter: any = 1;
  counter2: any = 1;
  jsondata: any;
  childData: any;

  overview: any;
  id: String = '';
  email = 'admin@xnode.ai';
  constructor(private apiService: ApiService) {

  }
  ngOnInit(): void {
    this.jsondata = data?.data;
    this.templates = [
      { label: 'FinBuddy' }
    ]
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

  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }


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
    this.apiService.getID(this.email)
      .then(response => {
        this.id = response.data.data[0].id;
        this.getMeOverview();
      })

      .catch(error => {
        console.log(error);
        this.loading = false;

      });
  }

  getMeOverview() {
    this.apiService.get("/retrive_overview/" + this.email + "/" + this.id)
      .then(response => {
        if (response?.status === 200) {
          console.log("this is response")
          console.log(response.data);
          console.log("this is response")

          this.overview = response.data;
        }
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
        this.loading = false;
      });

  }
}

