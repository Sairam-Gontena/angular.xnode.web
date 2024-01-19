import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/models/comment';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecificationUtilsService } from '../../diff-viewer/specificationUtils.service';
import { SpecificationsService } from 'src/app/services/specifications.service';

@Component({
  selector: 'xnode-comments-cr-panel',
  templateUrl: './comments-cr-panel.component.html',
  styleUrls: ['./comments-cr-panel.component.scss'],
})
export class CommentsCrPanelComponent implements OnInit {
  @Input() specData?: Array<[]>;
  @Input() swaggerData: any;
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
  userList: any;

  constructor(
    private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private storageService: LocalStorageService,
    private specificationUtils: SpecificationUtilsService,
    private specService: SpecificationsService
  ) {}

  ngOnInit(): void {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.userList = this.storageService.getItem(StorageKeys.USERLIST);
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
      let indexObj = { index: this.activeIndex };
      // this.switchHeaders(indexObj);
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('deep_link_info');
    this.specificationUtils.openConversationPanel(null);
    this.specificationUtils.saveCommentList(null);
    this.utils.saveSelectedSection(null);
  }

  onClickClose() {
    this.specificationUtils.openConversationPanel({
      openConversationPanel: false,
    });
    this.specificationUtils.saveCommentList(null);
    this.utils.saveSelectedSection(null);
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
    this.specificationUtils.openConversationPanel({
      openConversationPanel: true,
      parentTabIndex: this.activeIndex,
      childTabIndex: 0,
    });
    const version: any = this.storageService.getItem(StorageKeys.SpecVersion);
    if (event.index === 1) {
      this.specService.getMeCrList({ productId: this.product.id });
    } else {
      console.log('!@!@!@');

      this.specService.getMeAllComments({
        productId: this.product.id,
        versionId: version.id,
      });
    }
  }
}
