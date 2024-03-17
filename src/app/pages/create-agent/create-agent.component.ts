import { Component } from '@angular/core';
import { CreateAgentModel } from './create-agent.model';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';

@Component({
  selector: 'xnode-create-agent',
  templateUrl: './create-agent.component.html',
  styleUrls: ['./create-agent.component.scss'],
})
export class CreateAgentComponent {
  createAgentModel: CreateAgentModel;

  constructor(private storageService: LocalStorageService) {
    this.createAgentModel = new CreateAgentModel(this.storageService);
  }
}
