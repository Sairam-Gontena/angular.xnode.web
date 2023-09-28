import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UtilsService } from 'src/app/components/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'xnode-specifications-content',
  templateUrl: './specifications-content.component.html',
  styleUrls: ['./specifications-content.component.scss']
})

export class SpecificationsContentComponent implements OnInit {
  @Input() specData: any;
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  iframeSrc: SafeResourceUrl = '';
  showMoreContent?: boolean = false;
  selectedSpecItem: any;
  specItemList: any = [];
  selectedSpecItemListTitles: any = [];
  selectedSectionIndex: any;
  specItemIndex: any;
  targetUrl: string = environment.naviAppUrl;

  constructor(private utils: UtilsService, private domSanitizer: DomSanitizer,) {
    this.utils.getMeSpecItem.subscribe((event: any) => {
      if (event) {
        event.forEach((element: any) => {
          if (this.specItemList.length === 0) {
            this.specItemList = element.section;
          } else {
            this.specItemList = this.specItemList.concat(element.section)
          }
        });
      }
    })
    this.utils.getMeSpecItemIndex.subscribe((event: any) => {
      if (event) {
        this.specItemIndex = event;
      }
    })
    this.utils.getMeSectionIndex.subscribe((event: any) => {
      if (event) {
        this.scrollToItem(event.title)
      }
    })
  }

  ngOnInit(): void {
    const product = localStorage.getItem('product');
    let userData: any
    userData = localStorage.getItem('currentUser');
    let email = JSON.parse(userData).email;
    let user_id = JSON.parse(userData).id;
    let product_id: any;
    if (product) {
      product_id = JSON.parse(product).id;
    }
    this.targetUrl = environment.designStudioAppUrl + "?email=" + email + "&id=" + product_id + "&targetUrl=" + environment.xnodeAppUrl + "&has_insights=" + true + '&isVerified=true' + "&userId=" + user_id;
    this.makeTrustedUrl();
  }

  isArray(item: any) {
    return Array.isArray(item?.content);
  }

  onClickSeeMore(item: any, i: any): void {
    this.selectedSectionIndex = i;
    this.showMoreContent = !this.showMoreContent;
    this.specItemList.forEach((obj: any) => {
      if (obj.title === item.title) {
        obj.collapsed = true;
      }
    })
  }

  scrollToItem(itemId: string) {
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getMeBanner(event: any) {
    return './assets/' + event.title.toLowerCase().replace(/ /g, '') + '.svg';
  }

  makeTrustedUrl(): void {
    this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);;
  }
}
