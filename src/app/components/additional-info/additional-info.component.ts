import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'xnode-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss']
})
export class AdditionalInfoComponent {
  visible: boolean = true;

  showDialog() {
    this.visible = true;
  }
}
