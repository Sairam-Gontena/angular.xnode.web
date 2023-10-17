import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/components/services/utils.service';
import { ApiService } from 'src/app/api/api.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as _ from "lodash";

@Component({
  selector: 'xnode-specifications-menu',
  templateUrl: './specifications-menu.component.html',
  styleUrls: ['./specifications-menu.component.scss']
})

export class SpecificationsMenuComponent implements OnInit {
  @Input() specData?: any;
  @Output() text: EventEmitter<any> = new EventEmitter();
  selectedSpec: any;
  selectedSection: any;
  activeIndex: any = 0;
  menuList: any;
  selectedSecIndex: any;
  searchText: any;
  private textInputSubject = new Subject<string>();
  isOpen = true;

  constructor(
    private utils: UtilsService,
    private apiService: ApiService
  ) {
    this.utils.getMeSpecItem.subscribe((resp: any) => {
      setTimeout(() => {
        let data = resp;
        for (const key in data) {
          if (data[key] && data[key].search === true) {
            delete data[key];
            break;
          }
        }
        this.menuList = data.filter((item: any) => item !== null);
        console.log('menu menulist', this.menuList)
      },);
    })
  }

  ngOnInit(): void {
    this.utils.openSpecSubMenu.subscribe((data: any) => {
      this.isOpen = data;
    })
    this.utils.passSelectedSpecIndex(0);
    this.populateMenuList();
    this.textInputSubject.pipe(debounceTime(1000)).subscribe(() => {
      if (this.searchText.length > 0) {
        this.text.emit(this.searchText);
      } else {
        this.text.emit('');
      }
    });
  }

  populateMenuList() {
    let list = this.specData;
    list.forEach((element: any) => {
      if (element.section) {
        element.section.splice(0, 1);
      }
    });
    this.menuList = [...list]
  }

  onOpenAccordian(event: any) {
    this.activeIndex = event.index;
    this.selectedSecIndex = null;
    this.utils.passSelectedSpecIndex(event.index);
  }

  onClickSection(event: any, i: any) {
    this.selectedSection = event;
    this.selectedSecIndex = i;
    this.utils.passSelectedSectionIndex(event);
  }

  // not using this function
  getMeSpecList(): void {
    this.apiService.getApi("specs/retrieve/" + '0b398791-1dc2-4fd6-b78b-b73928844e36')
      .then(response => {
        if (response?.status === 200 && !response.data.detail) {
          const list = response.data;
          list.forEach((obj: any) => {
            if (obj?.title) {
              obj.section.unshift({ title: obj.title, created_by: obj.created_by, created_on: obj.created_on, modified_by: obj.modified_by, modified_on: obj.modified_on })
            }
          })

          this.specData = response.data;
          this.specData.pop();
        } else {
          this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: response.data.detail });
        }
        this.utils.loadSpinner(false);

      }).catch(error => {
        this.utils.loadToaster({ severity: 'error', summary: 'Error', detail: error });
      });
  }

  shortTitle(title: string) {
    let shortTitle = title?.length > 20 ? title.substring(0, 23) + '...' : title
    return shortTitle
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.utils.EnableSpecSubMenu()
    } else {
      this.utils.disableSpecSubMenu();
    }
  }

  onInput() {
    this.textInputSubject.next(this.searchText);
  }

}
