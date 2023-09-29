import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from 'src/app/components/services/utils.service';
import { ApiService } from 'src/app/api/api.service';
@Component({
  selector: 'xnode-specifications-menu',
  templateUrl: './specifications-menu.component.html',
  styleUrls: ['./specifications-menu.component.scss']
})

export class SpecificationsMenuComponent implements OnInit {
  @Input() specData?: any;;
  selectedSpec: any;
  selectedSection: any;
  activeIndex: any = 0;
  menuList: any;
  selectedSecIndex: any;

  constructor(
    private utils: UtilsService,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    this.utils.passSelectedSpecIndex(0);
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
    let shortTitle = title.length > 20 ? title.substring(0, 23) + '...' : title
    return shortTitle
  }

}
