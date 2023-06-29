import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss']
})
export class UseCasesComponent implements OnInit {

  useCases: any;
  id: String = '';
  email = 'admin@xnode.ai';

  constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    this.get_ID();
  }
  //get calls 
  get_ID() {
    this.apiService.getID(this.email)
      .then(response => {
        this.id = response.data.data[0].id;
        this.get_Usecases();
      })
      .catch(error => {
        console.log(error);
      });
  }

  get_Usecases() {
    this.apiService.getUsecase(this.email, this.id)
      .then(response => {
        var insightsData = response?.data?.data?.insights_data;
        //this.useCases = insightsData?.find((element: { hasOwnProperty: (arg0: string) => any; }) => element.hasOwnProperty("Usecase"))?.Usecase;
        this.useCases = insightsData?.Usecase;
      })
      .catch(error => {
        console.log(error);
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
