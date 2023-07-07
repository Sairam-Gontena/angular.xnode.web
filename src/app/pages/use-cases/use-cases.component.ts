import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';

@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss']
})
export class UseCasesComponent implements OnInit {
  useCases: any = [];
  id: String = '';
  loading: boolean = true;
  currentUser?: User;
  templates: any;
  highlightedIndex: any;
  constructor(private apiService: ApiService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    if (localStorage.getItem('record_id') === null) {
      this.get_ID();
    } else {
      this.get_Usecases();
    }
    this.templates = [
      { label: localStorage.getItem("app_name") }
    ]
  }
  openNewTab(): void {
    window.open('https://xnode-template-builder.azurewebsites.net/', '_blank');
  }
  //get calls 
  get_ID() {
    this.apiService.get("/get_metadata/" + this.currentUser?.email)
      .then(response => {
        this.id = response.data.data[0].id;
        localStorage.setItem('record_id', response.data.data[0].id);
        this.get_Usecases();
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
        this.loading = false;
      });
  }

  onIconClicked(e: any): void {

  }

  get_Usecases() {
    this.apiService.get("/retrive_insights/" + this.currentUser?.email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.useCases = data.usecase
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
      });

  }
}
