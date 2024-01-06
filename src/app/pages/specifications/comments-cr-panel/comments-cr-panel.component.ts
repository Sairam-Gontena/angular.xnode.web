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

  constructor(
    private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private storageService: LocalStorageService,
    private commentsService: CommentsService
  ) { }

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product)
    this.specUtils.loadActiveTab.subscribe((res: any) => {
      if (res) {
        this.activeIndex = res.activeIndex;
      } else {
        this.activeIndex = 0;
      }
    });
    this.specUtils.getMeCrList.subscribe((res: any) => {
      if (res) {
        this.crData = res;
      }
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('deep_link_info');
    this.specUtils._productDropdownChanged(false);
    this.specUtils.changeSpecConversationPanelFrom('');
    this.specUtils._tabToActive(null);
    this.specUtils._getMeSpecLevelCommentsTask(null);
    this.specUtils._openCommentsPanel(false);
  }

  onClickClose() {
    this.specUtils._openCommentsPanel(false);
    this.utils.saveSelectedSection(null);
    this.specUtils._tabToActive(null);
    this.specUtils._getMeSpecLevelCommentsTask(null);
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
    if (event.index === 1) this.getCRList();
    this.specUtils.saveActivatedTab(event.index === 1 ? 'CR' : '');
  }

  getCRList() {
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
}
