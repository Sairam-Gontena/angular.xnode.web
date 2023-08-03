import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss'],
  providers: [MessageService]
})
export class UseCasesComponent implements OnInit {
  useCases: any = [];
  id: String = '';
  loading: boolean = true;
  currentUser?: User;
  templates: any;
  highlightedIndex: any;

  constructor(private apiService: ApiService, private messageService: MessageService, private utilService: UtilsService) {
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
        this.utilService.endSpinnerInApp('error', error.message, error.code);
      });
  }

  onIconClicked(e: any): void {

  }

  get_Usecases() {
    this.utilService.startSpinnerInApp()
    this.apiService.get("/retrive_insights/" + this.currentUser?.email + "/" + localStorage.getItem('record_id'))
      .then(response => {
        if (response?.status === 200) {
          const data = Array.isArray(response?.data) ? response?.data[0] : response?.data;
          this.useCases = data?.usecase || [];
        }
        this.loading = false;
        this.utilService.endSpinner()
      })
      .catch(error => {
        this.utilService.endSpinnerInApp('error', error.message, error.code);
      });
    console.log('useCases', this.useCases);

  }

}
