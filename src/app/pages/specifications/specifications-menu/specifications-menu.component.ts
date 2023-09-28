import { Component, OnInit, Input } from '@angular/core';
import { SPEC_DATA } from '../mock'
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

  constructor(
    private utils: UtilsService,
    private apiService: ApiService
  ) {
  }

  ngOnInit(): void {
    // this.utils.loadSpinner(true);
    // this.getMeSpecList();
  }

  onOpenAccordian(event: any, i: any) {
    console.log('iiiiiiii', i);

    this.selectedSpec = event;
    this.activeIndex = i
    // this.utils.passSelectedSpecItem(event);
  }

  onClickSection(event: any) {
    this.selectedSection = event;
  }

  getMeSpecList(): void {
    this.apiService.getApi("specs/retrieve/" + '0b398791-1dc2-4fd6-b78b-b73928844e36')
      .then(response => {
        if (response?.status === 200 && !response.data.detail) {
          console.log('response.data', response.data);
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
