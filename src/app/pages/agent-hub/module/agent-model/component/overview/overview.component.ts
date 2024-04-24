import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  public overviewForm!: FormGroup;
  public overViewObj: any = {
    formEditable: false
  }

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private agentHubService: AgentHubService,
    private utilsService: UtilsService) {
    this.overviewForm = this.formBuilder.group({
      name: [''],
      description: [''],
      temperature: [''],
      max_context_length: ['']
    });
    this.overviewForm.disable();
  }

  ngOnInit() {
    this.getModelDetailByID(); //get model detail by modelID
  }

  //get model detail by modelID
  getModelDetailByID() {
    let urlParam: any = {
      url: ("agent/model_by_id/" + this.activatedRoute.snapshot.paramMap.get('id'))
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.getModelDetailByID(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.overviewForm.patchValue({
            name: response?.name,
            description: response?.description,
            temperature: response?.temperature,
            max_context_length: response?.max_context_length
          });
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error?.error.detail });
        this.utilsService.loadSpinner(false);
      }
    });
  }

  modelOverviewSubmit() {
    this.overViewObj.formEditable = false;
    this.overviewForm.disable();
  }

  //on edit save event
  onEditSaveEvent() {
    this.overViewObj.formEditable = !this.overViewObj.formEditable;
    this.overViewObj.formEditable ? this.overviewForm.enable() : this.overviewForm.disable();
  }

}
