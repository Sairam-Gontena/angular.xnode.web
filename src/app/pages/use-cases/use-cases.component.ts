import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss']
})
export class UseCasesComponent implements OnInit {

  useCases: any = [];
  id: String = '';
  email = 'admin@xnode.ai';
  loading: boolean = true;

  constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    this.get_ID();
  }
  //get calls 
  get_ID() {
    this.apiService.get("/get_metadata/" + this.email)
      .then(response => {
        this.id = response.data.data[0].id;
        this.get_Usecases();
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
        this.loading = false;
      });
  }

  get_Usecases() {
    this.apiService.get("/retrive_insights/" + this.email + "/" + this.id)
      .then(response => {
        if (response?.status === 200) {
          const data = response?.data?.insights_data;
          if (Array.isArray(data.Usecase) && data.Usecase[0].Response) {
            this.useCases = data.Usecase[0].Response
          } else if (Array.isArray(data.Usecase) && !data.Usecase[0].Response) {
            this.useCases = data.Usecase[0]
          } else if (!Array.isArray(data.Usecase) && data.Usecase.Response) {
            this.useCases = data.Usecase.Response
          } else {
            this.useCases = data.Usecase
          }
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
      });

  }

  //convert string to JSON
  stringToJSON(string: any) {
    for (let item of string) {
      // item = JSON.stringify(item);
      item = JSON.parse(item);
    }
  }

}
