import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'xnode-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss'],
  providers: [MessageService]
})
export class UseCasesComponent implements OnInit {

  constructor() {

  }

  ngOnInit(): void {
  }

}
