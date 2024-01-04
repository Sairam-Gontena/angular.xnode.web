import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/models/comment';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { CommentsService } from 'src/app/api/comments.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-comments-tabs',
  templateUrl: './comments-tabs.component.html',
  styleUrls: ['./comments-tabs.component.scss']
})

export class CommentsTabsComponent implements OnInit {
  list: Array<Comment> = [];
  @Input() usersList: any;
  @Input() swaggerData: any;
  activeIndex: number = 0;
  tabTypes: Array<string> = ['Comments', 'Tasks'];
  product: any;
  specVersion: any;
  commentsAdded: boolean = false;
  taskssAdded: boolean = false;

  constructor(
    public specUtils: SpecUtilsService,
    private utils: UtilsService,
    private commentsService: CommentsService,
    private storageService: LocalStorageService
  ) {
    this.specUtils.tabToActive.subscribe((event: any) => {
      if (event === 'COMMENT') {
        this.activeIndex = 0;
        this.specVersion = this.storageService.getItem(StorageKeys.SpecVersion);
        this.getMeSpecLevelCommentsList();
      } else if (event === 'TASK') {
        this.activeIndex = 1;
        this.specVersion = this.storageService.getItem(StorageKeys.SpecVersion);
        this.getMeSpecLevelTaskList();
      }
    })

    this.specUtils.isSpecVersionChanged.subscribe((event: any) => {
      console.log('event', event, this.activeIndex);

      if (event && this.activeIndex === 0) {
        this.specVersion = this.storageService.getItem(StorageKeys.SpecVersion);
        this.getMeAllCommentsList();
      }
      if (event && this.activeIndex === 1) {
        this.specVersion = this.storageService.getItem(StorageKeys.SpecVersion);
        this.getMeAllTaskList();
      }
    })
  }

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.specVersion = this.storageService.getItem(StorageKeys.SpecVersion);
    this.getMeAllCommentsList();
  }

  ngOnDestroy() {
    this.specUtils.changeSpecConversationPanelFrom('');
    this.specUtils._tabToActive(null);
  }

  onTabChange(event: any) {
    this.activeIndex = event.index;
    if (event.index === 0) {
      this.getMeAllCommentsList();
    } else {
      this.getMeAllTaskList();
    }
  }


  getMeAllCommentsList() {
    this.utils.loadSpinner(true);
    this.commentsService.getCommentsByProductId({ productId: this.product?.id, versionId: this.specVersion.id }).then((response: any) => {
      if (response.status === 200 && response.data) {
        this.list = response.data;
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      console.log(err);
      this.utils.loadSpinner(false);
    });

  }

  getMeSpecLevelCommentsList() {
    this.utils.loadSpinner(true);
    let specData = localStorage.getItem('selectedSpec');
    let selectedSpec: any;
    if (specData) {
      selectedSpec = JSON.parse(specData);
      this.commentsService.getComments({ parentId: selectedSpec.id, isReplyCountRequired: true }).then((response: any) => {
        if (response.status === 200 && response.data) {
          this.list = response.data;
        }
        this.utils.loadSpinner(false);
      }).catch(err => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
    }
  }

  getMeSpecLevelTaskList() {
    this.utils.loadSpinner(true);
    let specData = localStorage.getItem('selectedSpec');
    let selectedSpec: any;
    if (specData) {
      selectedSpec = JSON.parse(specData);
      this.commentsService.getTasks({ parentId: selectedSpec.id, isReplyCountRequired: true }).then((response: any) => {
        if (response.status === 200 && response.data) {
          this.list = response.data;
        }
        this.utils.loadSpinner(false);
      }).catch(err => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
    }
  }

  getMeAllTaskList() {
    this.utils.loadSpinner(true);
    this.commentsService.getTasksByProductId({ productId: this.product?.id, versionId: this.specVersion.id }).then((response: any) => {
      if (response.status === 200 && response.data) {
        this.list = response.data;
      }
      this.utils.loadSpinner(false);
    }).catch(err => {
      console.log(err);
      this.utils.loadSpinner(false);
    });
  }
}
