import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AgentHubService } from 'src/app/api/agent-hub.service';
import { UtilsService } from 'src/app/components/services/utils.service';

@Component({
  selector: 'xnode-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent {
  @Input() modelId: string | undefined;
  public configurationForm!: FormGroup;
  public configuationObj: any = {
    modelDetailData: "",
  }

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private agentHubService: AgentHubService,
    private utilsService: UtilsService) {
    this.configurationForm = this.formBuilder.group({
      model_configuration: ['']
    })
  }

  ngOnInit() {
    this.getModelDetailByID();
  }

  //get model detail by modelID
  getModelDetailByID() {
    let urlParam: any = {
      url: ("/agent/model_by_id/" + (this.modelId ?? this.activatedRoute.snapshot.paramMap.get('id')))
    }
    this.utilsService.loadSpinner(true);
    this.agentHubService.getModelDetailByID(urlParam).subscribe({
      next: (response: any) => {
        if (response) {
          this.configuationObj.modelDetailData = response;
          this.configurationForm.patchValue({ model_configuration: JSON.stringify(response.model_configuration, null, 2) });
        } else if (response?.detail) {
          this.utilsService.loadToaster({ severity: 'error', summary: '', detail: response?.detail });
        }
        this.utilsService.loadSpinner(false);
      }, error: (error: any) => {
        this.utilsService.loadToaster({ severity: 'error', summary: '', detail: error });
        this.utilsService.loadSpinner(false);
      }
    });
  }
}
