import { Component } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss']
})
export class UseCasesComponent {

  data : String = '';
  id : String = '';
  email = 'admin@xnode.ai';

  constructor( private apiService : ApiService) {}

  //get calls 
  get_ID(){
    this.apiService.getID(this.email)
    .then(response=> {
      this.id = response.data;
      console.log("In UseCaseComponent--> ID",this.id);
    })
    .catch(error =>{
      console.log(error);
    });
  }

  get_Usecases(){
    this.apiService.getUsecase(this.email, this.id)
    .then(response => {
      this.data = response.data;
      console.log("In UseCaseComponent--> Insights data",this.data);
    })
    .catch(error => {
      console.log(error);
    });

  }

}
