import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'xnode-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  providers: [MessageService]
})

export class TemplatesComponent implements OnInit {
  loading: boolean = true;
  id: String = '';
  templateCard: any;
  currentUser?: User;
  constructor(public router: Router, private apiService: ApiService, private messageService: MessageService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.getMeUserId();
  }

  onClickCreateNewTemplate(data: any): void {
    localStorage.setItem('record_id', data.id);
    localStorage.setItem('app_name', data.title);
    this.router.navigate(['/design']);
  }
  onClickgotoxPilot() {
    this.router.navigate(['/x-pilot']);
  }

  //get calls 
  getMeUserId() {
    this.apiService.get("/get_metadata/" + this.currentUser?.email)
      .then(response => {
        if (response?.status === 200) {
          this.id = response.data.data[0].id;
          this.templateCard = response.data.data;
        }
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
        this.loading = false;
        this.showToast('error', error.message, error.code);
      });
  }

  showToast(severity: string, message: string, code: string) {
    this.messageService.clear();
    this.messageService.add({ severity: severity, summary: code, detail: message, sticky: true });
  }

}
