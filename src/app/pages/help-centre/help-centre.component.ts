import { Component, OnInit } from '@angular/core';
import helpcentre from '../../../assets/json/help_centre.json'
@Component({
  selector: 'xnode-help-centre',
  templateUrl: './help-centre.component.html',
  styleUrls: ['./help-centre.component.scss']
})
export class HelpCentreComponent implements OnInit {
  json: any;
  selectedjson: any;
  constructor() {
    this.json = helpcentre.helpcentre;
    this.selectedjson = this.json[0];
  }

  ngOnInit() {

  }

  showJson(subobj: any) {
    this.selectedjson = this.json.filter((item: any) => { return item.title === subobj })
    this.selectedjson = this.selectedjson[0]
  }

  sendEmail() {
    let mailElem = document.getElementById('mail') as HTMLElement;
    mailElem.click()
  }

}
