import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Comment } from 'src/models/comment';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { UtilsService } from 'src/app/components/services/utils.service';
import { CrTabsComponent } from 'src/app/cr-tabs/cr-tabs.component';
import { TabView } from 'primeng/tabview';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { CommentsService } from 'src/app/api/comments.service';

@Component({
  selector: 'xnode-comments-cr-panel',
  templateUrl: './comments-cr-panel.component.html',
  styleUrls: ['./comments-cr-panel.component.scss'],
})
export class CommentsCrPanelComponent implements OnInit {
  @ViewChild(CrTabsComponent, { static: true })
  child!: CrTabsComponent;
  @ViewChild(TabView)
  tabView!: TabView;
  @Input() specData?: Array<[]>;
  @Input() usersList: any;
  @Input() swaggerData: any;
  @Input() reveiwerList: any;
  userImage?: any = 'DC';
  username?: any;
  filterOptions: Array<DropdownOptions> = [
    { label: 'All Comments', value: 'all' },
  ];
  selectedFilter: string = 'All Comments';
  @Input() list: Array<Comment> = [];
  commentObj: any = {
    comment: '',
    role: '',
    user_id: '',
  };
  comment: any;
  currentUser: any;
  activeIndex: number = 0;
  crData: any = [];
  product: any;
  showSpecLevelComments: any;

  constructor(
    private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private storageService: LocalStorageService,
    private commentsService: CommentsService
  ) {
    this.specUtils.specLevelCommentsTasks.subscribe((event: any) => {
      this.showSpecLevelComments = event;
    });
  }

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.specUtils.getMeUpdatedCrs.subscribe((res: any) => {
      if (res) {
        this.crData = res;
      }
    });
    this.specUtils.loadActiveTab.subscribe((res: any) => {
      if (res) {
        this.activeIndex = res?.activeIndex ? res.activeIndex : res;
      } else {
        this.activeIndex = 0;
      }
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('deep_link_info');
    this.specUtils._openCommentsPanel(false);
    this.utils.saveSelectedSection(null);
    this.specUtils._tabToActive(null);
    this.specUtils._getMeSpecLevelCommentsTask(null);
    this.specUtils._getMeUpdatedComments(null);
    this.specUtils._getMeUpdatedCrs(null);
    this.specUtils._getMeUpdatedTasks(null);
    this.specUtils._specLevelCommentsTasks(null);
    this.specUtils._loadActiveTab(null);
    this.specUtils.saveActivatedTab(null);
  }

  onClickClose() {
    this.specUtils._openCommentsPanel(false);
    this.utils.saveSelectedSection(null);
    this.specUtils._tabToActive(null);
    this.specUtils._getMeSpecLevelCommentsTask(null);
    this.specUtils._getMeUpdatedComments(null);
    this.specUtils._getMeUpdatedCrs(null);
    this.specUtils._getMeUpdatedTasks(null);
    this.specUtils._specLevelCommentsTasks(null);
    this.specUtils._loadActiveTab(null);
    this.specUtils.saveActivatedTab(null);
  }

  onClickEnter(event: KeyboardEventInit) {
    if (event.key === 'Enter' && this.comment.trim().length !== 0) {
      this.onClickSend();
    }
  }

  onClickSend() {
    this.commentObj.comment = this.comment;
    this.commentObj.role = 'user';
    this.commentObj.user_id = this.currentUser.id;
    this.list.push(this.commentObj);
  }

  switchHeaders(event: any) {
    this.activeIndex = event.index;
    if (event.index === 1) {
      this.specUtils.saveActivatedTab('CR');
      this.getCRList();
    } else {
      if (this.showSpecLevelComments) {
        this.specUtils.saveActivatedTab('COMMENTS');
        this.getMeSpecLevelCommentsList();
      } else {
        this.specUtils.saveActivatedTab('COMMENTS');
        this.getMeAllCommentsList();
      }
    }
  }

  getMeAllCommentsList() {
    this.utils.loadSpinner(true);
    this.product = this.storageService.getItem(StorageKeys.Product);
    const specVersion: any = this.storageService.getItem(
      StorageKeys.SpecVersion
    );
    this.commentsService
      .getCommentsByProductId({
        productId: this.product?.id,
        versionId: specVersion.id,
      })
      .then((response: any) => {
        if (response.status === 200 && response.data) {
          this.specUtils._getMeUpdatedComments(response.data);
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
  }

  getCRList() {
    this.product = this.storageService.getItem(StorageKeys.Product);
    let body: any = {
      productId: this.product?.id,
    };
    this.utils.loadSpinner(true);
    this.commentsService
      .getCrList(body)
      .then((res: any) => {
        if (res && res.data) {
          this.crData = res.data;
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: res?.data?.common?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err: any) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
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
}
