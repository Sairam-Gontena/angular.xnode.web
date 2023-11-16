import { Component, Input } from '@angular/core';

@Component({
  selector: 'xnode-new-cr',
  templateUrl: './new-cr.component.html',
  styleUrls: ['./new-cr.component.scss']
})
export class NewCrComponent {
  @Input() visible: boolean = false;
  newCr: string = '';
}
