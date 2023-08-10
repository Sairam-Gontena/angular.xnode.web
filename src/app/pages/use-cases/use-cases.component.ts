import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';
import * as d3 from 'd3';
import * as flare from './flare.json'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss'],
  providers: [MessageService]
})
export class UseCasesComponent implements OnInit {
  useCases: any = [];
  id: String = '';
  currentUser?: User;
  templates: any;
  highlightedIndex: any;

  constructor(private apiService: ApiService, private messageService: MessageService, private utilService: UtilsService, private router: Router, private activateRoute: ActivatedRoute) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.utilService.loadSpinner(true);
    if (localStorage.getItem('record_id') === null) {
      this.get_ID();
    } else {
      this.get_Usecases();
    }
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ]
    // this.graph();
    console.log(this.router.events,this.router)
  }

  //get calls 
  get_ID() {
    this.apiService.get("/get_metadata/" + this.currentUser?.email)
      .then(response => {
        this.id = response.data.data[0].id;
        localStorage.setItem('record_id', response.data.data[0].id);
        this.get_Usecases();
        this.utilService.loadSpinner(false);
      })
      .catch(error => {
        this.utilService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilService.loadSpinner(false);
      });
  }

  onIconClicked(e: any): void {

  }

  get_Usecases() {
    this.apiService.get("/retrive_insights/" + this.currentUser?.email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.useCases = data?.usecase || [];
          // this.graph(this.useCases);
        }
        this.utilService.loadSpinner(false);
      })
      .catch(error => {
        this.utilService.loadToaster({ severity: 'error', summary: 'Error', detail: error });
        this.utilService.loadSpinner(false);
      });
  }

  
}
