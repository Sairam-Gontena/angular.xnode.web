import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  @Input() content: any;
  @Input() searchTerm: any;
  @Input() selectedContent!: string;
  @Input() users: any = [];
  showCommentIcon: boolean = false
  seletedMainIndex?: number;
  selecteedSubIndex?: number

  ngOnInit(): void {
  }

  isArray(item: any) {
    return Array.isArray(item);
  }

}
