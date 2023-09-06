import { Component, OnInit } from '@angular/core';
import helpcentre from '../../../assets/json/help_centre.json'
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as _ from "lodash";
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
  private textInputSubject = new Subject<string>();
  foundObjects: any[] = [];

  constructor(public location: Location) {
    this.json = helpcentre.helpcentre;
    this.selectedjson = this.json?.[0]?.objects?.[0];
  }

  ngOnInit() {
    this.textInputSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.searchText.length > 0 ? this.getSearchInput('', this.json) : this.clearSearchText();
    });
  }

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
    this.textInputSubject.next(this.searchText);
    if (this.searchText == '') {
      this.clearSearchText()
    }
    let keyword = this.searchText;
    obj.forEach((element: any) => {
      if (element.accordianTitle.toUpperCase().includes(keyword.toUpperCase())) {
        element?.objects?.forEach((subelement: any) => {
          subelement.subobjects.forEach((lastelems: any) => {
            if (lastelems.title.toUpperCase().includes(keyword.toUpperCase()) || lastelems.description.toUpperCase().includes(keyword.toUpperCase())) {
              this.foundObjects = _.uniq(_.concat(this.foundObjects, lastelems))
            }
            this.foundObjects = _.uniq(_.concat(this.foundObjects, lastelems))
          })
        })
      }
      if (element?.objects) {
        element?.objects?.forEach((element: any) => {
          element.subobjects.forEach((subelement: any) => {
            if (subelement.title.includes(keyword) || subelement.description.includes(keyword) || element.title.toUpperCase().includes(keyword.toUpperCase())) {
              this.foundObjects = _.uniq(_.concat(this.foundObjects, subelement))
            }
          })
        });
      }
    });
  }

  onInput() {
    this.textInputSubject.next(this.searchText);
  }
}
