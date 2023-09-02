import { Component, OnInit } from '@angular/core';
import helpcentre from '../../../assets/json/help_centre.json'
import { Router } from '@angular/router';
@Component({
  selector: 'xnode-help-centre',
  templateUrl: './help-centre.component.html',
  styleUrls: ['./help-centre.component.scss']
})
export class HelpCentreComponent implements OnInit {
  json: any;
  selectedjson: any;
  selectedMenuIndex: any;


  constructor(private router: Router) {
    this.json = helpcentre.helpcentre;
    this.selectedjson = this.json?.[0]?.objects?.[0];
  }

  ngOnInit() { }

  showJson(obj: any, accordianTitle: any, i: any) {
    let item = this.json.filter((item: any) => { return item.accordianTitle == accordianTitle });
    this.selectedjson = item[0].objects.filter((subitem: any) => { return subitem.title == obj })
    this.selectedjson = this.selectedjson[0];
    this.selectedMenuIndex = i;
  }

  sendEmail() {
    let mailElem = document.getElementById('mail') as HTMLElement;
    mailElem.click()
  }

}
