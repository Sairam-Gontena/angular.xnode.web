import { Component, OnInit } from '@angular/core';
import { SPEC_DATA } from '../mock'
@Component({
  selector: 'xnode-specifications-menu',
  templateUrl: './specifications-menu.component.html',
  styleUrls: ['./specifications-menu.component.scss']
})
export class SpecificationsMenuComponent implements OnInit {

  specData = SPEC_DATA;

  ngOnInit(): void {

  }

}
