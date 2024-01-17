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
  commentsAdded: boolean = false;
  taskssAdded: boolean = false;
  showSpecLevelComments: boolean = false;
  constructor(
    public specUtils: SpecUtilsService,
    private utils: UtilsService,
    private commentsService: CommentsService,
    private storageService: LocalStorageService
  ) {
    this.specUtils.tabToActive.subscribe((event: any) => {
      if (event === 'COMMENT') {
        this.activeIndex = 0;
      } else if (event === 'TASK') {
        this.activeIndex = 1;
      }
      let indexObj = { index:this.activeIndex }
      this.onTabChange(indexObj)
    });
    this.specUtils.specLevelCommentsTasks.subscribe((event: any) => {
      this.showSpecLevelComments = event;
    });
    this.specUtils.getMeUpdatedComments.subscribe((event: any) => {
      if (event) {
        this.activeIndex = 0;
        this.list = event;
      }
    });
    this.specUtils.getMeUpdatedTasks.subscribe((event: any) => {
      if (event) {
        this.activeIndex = 1;
        this.list = event;
      }
    });
  }

  ngOnInit(): void {
    this.specUtils.saveActivatedTab('COMMENTS');
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.specVersion = this.storageService.getItem(StorageKeys.SpecVersion);
  }

  ngOnDestroy() {
    this.specUtils._tabToActive(null);
    this.specUtils._getMeUpdatedComments(null);
    this.specUtils._getMeUpdatedTasks(null);
  }

  onTabChange(event: any) {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.specVersion = this.storageService.getItem(StorageKeys.SpecVersion);
    this.activeIndex = event.index;
    if (event.index === 0) {
      if (this.showSpecLevelComments) {
        this.getMeSpecLevelCommentsList();
      } else this.getMeAllCommentsList();
    } else {
      if (this.showSpecLevelComments) {
        this.getMeSpecLevelTaskList();
      } else this.getMeAllTaskList();
    }
    this.specUtils.saveActivatedTab(event.index === 1 ? 'TASKS' : 'COMMENTS');
  }

  getMeAllCommentsList() {
    this.utils.loadSpinner(true);
    this.commentsService
      .getCommentsByProductId({
        productId: this.product?.id,
        versionId: this.specVersion.id,
      })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.list = response.data;
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
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
      this.commentsService
        .getComments({ parentId: selectedSpec.id, isReplyCountRequired: true })
        .then((response: any) => {
          if (response.status === 200 && response.data) {
            this.list = response.data;
          }
          this.utils.loadSpinner(false);
        })
        .catch((err) => {
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
      this.commentsService
        .getTasks({ parentId: selectedSpec.id, isReplyCountRequired: true })
        .then((response: any) => {
          if (response.status === 200 && response.data) {
            this.list = response.data;
          }
          this.utils.loadSpinner(false);
        })
        .catch((err) => {
          console.log(err);
          this.utils.loadSpinner(false);
        });
    }
  }

  getMeAllTaskList() {
    this.utils.loadSpinner(true);
    this.commentsService
      .getTasksByProductId({
        productId: this.product?.id,
        versionId: this.specVersion.id,
      })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.list = response.data;
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
  }
}
