import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-user-persona',
  templateUrl: './user-persona.component.html',
  styleUrls: ['./user-persona.component.scss']
})
export class UserPersonaComponent implements OnInit {
  @Input() content: any
  @Input() searchTerm: any

  ngOnInit(): void {
  }
}
