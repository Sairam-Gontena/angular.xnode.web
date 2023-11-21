import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-user-persona',
  templateUrl: './user-persona.component.html',
  styleUrls: ['./user-persona.component.scss']
})
export class UserPersonaComponent implements OnInit {
  @Input() content: any
  @Input() searchTerm: any
  persona: any;

  ngOnInit(): void {
    if (this.content?.content && this.content?.content.length > 0)
      this.persona = this.content?.content[0]
  }
}
