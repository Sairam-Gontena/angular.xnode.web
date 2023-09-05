import { Component, OnInit } from '@angular/core';
import helpcentre from '../../../assets/json/help_centre.json'
import { Location } from '@angular/common';
@Component({
  selector: 'xnode-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})

export class HelpCenterComponent implements OnInit {
  json: any;
  selectedjson: any;
  selectedMenuIndex: any;
  visible: boolean = false;
  searchText: any;
  foundObjects: any[] = [];

  constructor(public location: Location) {
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


  showDialog() {
    this.visible = true;
  }

  sendEmail() {
    let mailElem = document.getElementById('mail') as HTMLElement;
    mailElem.click()
  }

  clearSearchText() {
    this.searchText = '';
    this.foundObjects = [];
  }

  getSearchInput(key: string, obj = this.json) {
    let keyword = this.searchText;
    if (typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'string' && obj[key].includes(keyword)) {
            this.foundObjects.push(obj);
            break;
          } else if (typeof obj[key] === 'object') {
            this.getSearchInput(keyword, obj[key]);
          }
        }
      }
    }
  }
}
