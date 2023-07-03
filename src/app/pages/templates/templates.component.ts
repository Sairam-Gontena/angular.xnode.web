import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'xnode-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})

export class TemplatesComponent implements OnInit {
  loading: boolean = true;
  id: String = '';
  email = 'admin@xnode.ai';
  templateCard: any;
  constructor(public router: Router, private apiService: ApiService,) {
  }

  ngOnInit(): void {
    this.getMeUserId()
  }

  onClickCreateNewTemplate(data: any): void {
    console.log('data', data);
    localStorage.setItem('record_id', data.id)
    this.router.navigate(['/design']);
  }
  onClickgotoxPilot() {
    this.router.navigate(['/x-pilot']);
  }
  //get calls 
  getMeUserId() {
    this.apiService.get("/get_metadata/" + this.email)
      .then(response => {
        if (response?.status === 200) {
          this.id = response.data.data[0].id;
          this.templateCard = response.data.data;
          // this.getMeDataModel();
        }
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
        this.loading = false;
      });
  }

}
