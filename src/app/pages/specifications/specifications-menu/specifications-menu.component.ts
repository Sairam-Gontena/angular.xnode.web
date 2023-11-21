import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/components/services/utils.service';
import { ApiService } from 'src/app/api/api.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as _ from "lodash";
import { SidePanel } from 'src/models/side-panel.enum';

@Component({
  selector: 'xnode-specifications-menu',
  templateUrl: './specifications-menu.component.html',
  styleUrls: ['./specifications-menu.component.scss']
})

export class SpecificationsMenuComponent implements OnInit {
  @Input() specData?: any;
  @Input() keyword?: any;
  @Output() searchtext: EventEmitter<any> = new EventEmitter();
  selectedSpec: any;
  menuList: any;
  selectedSection: any;
  activeIndex: any = [0];
  selectedSecIndex: any;
  searchText: any;
  multiAccordion: boolean = false;
  private textInputSubject = new Subject<string>();
  isOpen = true;

  constructor(
    private utils: UtilsService,
    private apiService: ApiService
  ) {
    this.utils.getMeSpecItem.subscribe((resp: any) => {
      setTimeout(() => {
        this.menuList = resp.filter((item: any) => item !== null);
      },);
    })
    this.utils.sidePanelChanged.subscribe((pnl: SidePanel) => {
      if (pnl === SidePanel.Comments) {
        this.isOpen = false;
        this.utils.disableSpecSubMenu();
      }
    })
  }

  ngOnInit(): void {
    this.utils.openSpecSubMenu.subscribe((data: any) => {
      this.isOpen = data;
    })
    this.populateMenuList();
    this.textInputSubject.pipe(debounceTime(1000)).subscribe(() => {
      if (this.searchText.length > 0) {
        this.searchtext.emit(this.searchText);
        this.multiAccordion = true;
      } else {
        this.searchtext.emit('');
        this.multiAccordion = false;
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
    localStorage.setItem('selectedSpec', JSON.stringify(this.specData[event.index]))
    this.selectedSection = this.specData[event.index].content[0];
    this.selectedSecIndex = 0;
    this.utils.saveSelectedSection(this.specData[event.index].content[0]);
    this.utils.updateConversationList('comment');
  }

  onSelectSpec(event: any, i: any) {
    this.selectedSection = event;
    this.selectedSecIndex = i;
    this.utils.saveSelectedSection(event);
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

  clearInput() {
    this.searchtext.emit('');
    this.searchText = '';
    this.multiAccordion = false;
    this.activeIndex = [0];
  }

  onInput() {
    this.textInputSubject.next(this.searchText);
  }

  ngOnChanges() {
    this.keyword = this.keyword;
    this.specData = this.specData;
    this.openAccordions();
  }

  openAccordions() {
    this.specData.forEach((element: any, index: any) => {
      this.activeIndex.push(index)
    });
    if (this.searchText?.length > 0)
      this.multiAccordion = true;
  }
}
