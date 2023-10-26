import { Component, Input } from '@angular/core';

@Component({
  selector: 'xnode-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent {
  @Input() content: any;
  @Input() searchTerm: any;

}
