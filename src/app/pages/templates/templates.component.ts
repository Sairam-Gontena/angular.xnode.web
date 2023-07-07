import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { UserUtil, User } from '../../utils/user-util';

@Component({
  selector: 'xnode-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})

export class TemplatesComponent implements OnInit {
  loading: boolean = true;
  id: String = '';
  templateCard: any;
  currentUser?: User;
  constructor(public router: Router, private apiService: ApiService) {
    this.currentUser = UserUtil.getCurrentUser();
  }

  ngOnInit(): void {
    this.getMeUserId()
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
      });
  }

}
