import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/models/comment';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecificationUtilsService } from '../../diff-viewer/specificationUtils.service';
import { SpecificationsService } from 'src/app/services/specifications.service';

@Component({
  selector: 'xnode-comments-tabs',
  templateUrl: './comments-tabs.component.html',
  styleUrls: ['./comments-tabs.component.scss'],
})
export class CommentsTabsComponent implements OnInit {
  list: Array<Comment> = [];
  @Input() usersList: any;
  @Input() swaggerData: any;
  activeIndex: any = null;
  tabTypes: Array<string> = ['Comments', 'Tasks'];
  product: any;
  specVersion: any;
  conversationPanelInfo: boolean = false;

  constructor(
    public specUtils: SpecUtilsService,
    private storageService: LocalStorageService,
    private specificationUtils: SpecificationUtilsService,
    private specService: SpecificationsService
  ) {
    this.specificationUtils._openConversationPanel.subscribe((data: any) => {
      if (data) {
        this.conversationPanelInfo = data;
        this.activeIndex = data.childTabIndex;
      }
      let indexObj = { index: this.activeIndex };
      this.onTabChange(indexObj);
    });
    this.specUtils.getMeUpdatedComments.subscribe((event: any) => {
      if (event) {
        this.activeIndex = 0;
        this.list = event;
      }
    });
    this.specificationUtils.getMeTaskList.subscribe((data: any) => {
      if (data) {
        this.list = data;
      }
    });
  }

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.specVersion = this.storageService.getItem(StorageKeys.SpecVersion);
  }

  ngOnDestroy() {}

  onTabChange(event: any) {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.specVersion = this.storageService.getItem(StorageKeys.SpecVersion);
    this.activeIndex = event.index;
    this.specificationUtils.openConversationPanel({
      openConversationPanel: true,
      parentTabIndex: 0,
      childTabIndex: event.index,
    });
    if (event.index === 0) {
      this.specService.getMeAllComments({
        productId: this.product.id,
        versionId: this.specVersion.id,
      });
    } else {
      this.specService.getMeAllTasks({
        productId: this.product.id,
        versionId: this.specVersion.id,
      });
    }
  }
}
