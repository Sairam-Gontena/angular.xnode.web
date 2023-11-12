import { Component, Input, OnInit } from '@angular/core';
import { isArray } from 'lodash';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { LocalStorageService } from '../components/services/local-storage.service';
import { MessagingService } from '../components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';

@Component({
  selector: 'xnode-link-to-cr',
  templateUrl: './link-to-cr.component.html',
  styleUrls: ['./link-to-cr.component.css']
})
export class LinkToCrComponent implements OnInit {
  @Input() comment: any;
  specData: any;
  prSpecsTitle: string = "";
  constructor(private localStorageService: LocalStorageService, private messagingService: MessagingService) { }

  ngOnInit() {
    this.messagingService.getMessage<any>().subscribe(msg => {
      if (msg.msgType === MessageTypes.LinkToCR) {
        if (this.comment) {
          this.specData = this.localStorageService.getItem(StorageKeys.SpecData);
          this.getSpecsTitle();
        }
      }
    });

  }
  getSpecsTitle() {
    const currentSpec = this.specData.find((m: any) => m.id === this.comment.topParentId);
    if (currentSpec && isArray(currentSpec.content) && currentSpec.content.length > 0) {
      const titles = this.getBreadcrumbTitles(currentSpec.content, this.comment.parentId);
      if (titles) {
        this.prSpecsTitle = titles.join(" > ");
      }
    }
    else {
      this.prSpecsTitle = currentSpec.title;
    }
  }

  getBreadcrumbTitles(specs: any, parentId: string): string[] | null {
    for (const item of specs) {
      if (item.id === this.comment.parentId) {
        return [item.title];
      }
      const subBreadcrumb = this.getBreadcrumbTitles(item.content, parentId);
      if (subBreadcrumb !== null) {
        return [item.title, ...subBreadcrumb];
      }
    }
    return null;
  }

}
