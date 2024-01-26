import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from 'src/app/components/services/utils.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';
import { SpecificationUtilsService } from '../../diff-viewer/specificationUtils.service';
import { SearchspecService } from 'src/app/api/searchspec.service';

@Component({
  selector: 'xnode-specifications-menu',
  templateUrl: './specifications-menu.component.html',
  styleUrls: ['./specifications-menu.component.scss'],
})
export class SpecificationsMenuComponent implements OnInit {
  @Input() specData?: any;
  @Input() keyword?: any;
  @Output() searchtext: EventEmitter<any> = new EventEmitter();
  @Output() onSelectSpecMenuItem: EventEmitter<any> = new EventEmitter();
  @Output() isMeneOpened: EventEmitter<any> = new EventEmitter();
  selectedSpec: any;
  menuList: any;
  selectedSection: any;
  activeIndex: any = [0];
  selectedSecIndex: any;
  searchText: any;
  multiAccordion: boolean = false;
  private textInputSubject = new Subject<string>();

  constructor(
    private utils: UtilsService,
    private SpecificationUtils: SpecificationUtilsService,
    private searchSpec:SearchspecService
  ) {
    this.utils.getMeSpecItem.subscribe((resp: any) => {
      setTimeout(() => {
        if (resp) this.menuList = resp?.filter((item: any) => item !== null);
      });
    });

    // this.SpecificationUtils._openConversationPanel.subscribe((data: any) => {
    //   console.log('dataaa', data);

    //   if (data) {
    //     this.isSideMenuOpened = !data.openConversationPanel;
    //     this.utils.disableSpecSubMenu();
    //   } else {
    //     this.isSideMenuOpened = true;
    //   }
    // });
  }

  ngOnInit(): void {
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
    if (list?.length) {
      list.forEach((element: any) => {
        if (element.section) {
          element.section.splice(0, 1);
        }
      });
      this.menuList = [...list];
    }
  }

  onOpenAccordian(event: any) {
    this.activeIndex = event.index;
    this.selectedSecIndex = null;
    localStorage.setItem(
      'selectedSpec',
      JSON.stringify(this.specData[event.index])
    );
    this.selectedSection = this.specData[event.index].content[0];
    this.selectedSecIndex = 0;
    this.utils.saveSelectedSection(this.specData[event.index].content[0]);
    this.utils.updateConversationList('comment');
  }

  onSelectSpec(event: any, i: any) {
    this.selectedSection = event;
    this.selectedSecIndex = i;
    this.onSelectSpecMenuItem.emit(event);
  }

  shortTitle(title: string) {
    let shortTitle =
      title?.length > 20 ? title.substring(0, 23) + '...' : title;
    return shortTitle;
  }

  toggleMenu() {
    this.isMeneOpened.emit(false);
  }

  clearInput() {
    this.searchtext.emit('');
    this.searchSpec.keyword = '';
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
    if (this.specData?.length)
      this.specData.forEach((element: any, index: any) => {
        this.activeIndex.push(index);
      });
    if (this.searchText?.length > 0) this.multiAccordion = true;
  }
}
