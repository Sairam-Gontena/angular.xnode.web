import { Component } from '@angular/core';
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
