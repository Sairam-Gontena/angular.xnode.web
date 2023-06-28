import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss']
})
export class UseCasesComponent implements OnInit {

  useCases: String = '';
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
        console.log("In UseCaseComponent--> ID", this.id);
        this.get_Usecases();
      })
      .catch(error => {
        console.log(error);
      });
  }

  get_Usecases() {
    this.apiService.getUsecase(this.email, this.id)
      .then(response => {
        console.log('response', response);
        this.useCases = response?.data?.data?.insights_data[0]?.Usecase;
      })
      .catch(error => {
        console.log(error);
      });

  }

}
