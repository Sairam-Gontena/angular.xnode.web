import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { UtilsService } from '../../../components/services/utils.service';
import { CommentsService } from '../../../api/comments.service';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { MessagingService } from '../../../components/services/messaging.service';
import { MessageTypes } from 'src/models/message-types.enum';
import { SpecChildConversationComponent } from '../spec-child-conversation/spec-child-conversation.component';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SECTION_VIEW_CONFIG } from '../section-view-config';
declare const SwaggerUIBundle: any;
import { Subscription, delay, of } from 'rxjs';
import { SpecificationsService } from 'src/app/services/specifications.service';
@Component({
  selector: 'xnode-spec-conversation',
  templateUrl: './spec-conversation.component.html',
  styleUrls: ['./spec-conversation.component.scss'],
})
export class SpecConversationComponent {
  @Input() list: any;
  @Input() usersList: any;
  @Input() topParentId: any;
  @Input() activeIndex: any;
  @Input() parentEntity: any;
  @Input() parentId: any;
  @Input() swaggerData: any;
  @Input() searchIconKeyword: any;
  @Output() onClickClose = new EventEmitter<any>();
  @ViewChild(SpecChildConversationComponent)
  child!: SpecChildConversationComponent;
  paraViewSections = SECTION_VIEW_CONFIG.paraViewSections;
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;
  userRolesViewSections = SECTION_VIEW_CONFIG.userRoleSection;
  userPersonaViewSections = SECTION_VIEW_CONFIG.userPersonaSection;
  comment: any;
  currentUser: any;
  selectedSection: any;
  showNewCrPopup: boolean = false;
  selectedComment: any;
  showCommentInput: boolean = false;
  openEditComment: boolean = false;
  selectedIndex?: number;
  showDeletePopup: boolean = false;
  action?: string;
  showCrPopup: boolean = false;
  usersData: any;
  showReplies: boolean = false;
  replies: any;
  specListCopy: any;
  specList: any[] = [];
  childSpecListCount: any;
  commentDelete: any;
  uploadedFiles: any;
  references: any;
  iframeSrc: SafeResourceUrl = '';
  showConfirmationPopup: boolean = false;
  files: any[] = [];
  confirmarionContent: string = '';
  confirmarionHeader: string = '';
  fileIndex: any;
  targetUrl: string = '';
  bpmnFrom: string = 'SPEC'; //;  'Comments'
  private searchKeywordSubscription: Subscription = new Subscription();
  private searchByUserSubscription: Subscription = new Subscription();
  product: any;

  constructor(
    private utils: UtilsService,
    private commentsService: CommentsService,
    private sanitizer: DomSanitizer,
    private specUtils: SpecUtilsService,
    private messagingService: MessagingService,
    private storageService: LocalStorageService,
    private specService: SpecificationsService
  ) {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser);
    this.utils.getMeLatestConversation.subscribe((event: any) => {
      if (event === 'reply') {
        this.showCommentInput = false;
        this.action = '';
      }
    });
    this.product = this.storageService.getItem(StorageKeys.Product)
  }

  ngOnInit() {
    this.specListCopy = this.list;
    this.makeTrustedUrl();
    this.checkSwaggerItem();
    this.searchKeywordSubscription = this.specUtils
      .getCommentSearchByKeywordListData()
      .subscribe((data: any) => {
        this.filterListBySearch(data);
      });
    this.searchByUserSubscription = this.specUtils
      .getCommentSearchByUsersListData()
      .subscribe((data: any) => {
        this.filterListByUsersFilter(data);
      });
  }

  filterListBySearch(users?: any) {
    if (this.searchIconKeyword.length > 0) {
      this.searchIconKeyword = this.searchIconKeyword.toLowerCase();
      this.list = this.list.filter((item: any) =>{
        const msg = item.message.toLowerCase();
        return msg.includes(this.searchIconKeyword)
      });
    } else {
      this.list = this.specListCopy;
    }
    if (users?.length>0) {
      this.filterListByUsersFilter(users);
      return;
    }
  }

  filterListByUsersFilter(users: any) {
    if (users?.length > 0) {
      this.list = this.specListCopy;
      this.list = this.list.filter((item: any) =>
        users.includes(item.createdBy.userId) ||  item.references?.some((ref: any) => users.includes(ref.entity_id))
      );
    } else {
      this.list = this.specListCopy;
    }
    if (this.searchIconKeyword?.length > 0) {
      this.filterListBySearch();
      return;
    }
  }

  checkSwaggerItem() {
    if (this.list.length)
      this.list.forEach((item: any) => {
        if (item.referenceContent.title == 'OpenAPI Spec') {
          of([])
            .pipe(delay(500))
            .subscribe((results) => {
              this.fetchOpenSpecApi(item.id);
            });
        }
      });
  }

  fetchOpenSpecApi(id: any) {
    const ui = SwaggerUIBundle({
      domNode: document.getElementById('openapi-ui-spec' + id),
      layout: 'BaseLayout',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset,
      ],
      spec: this.swaggerData,
      docExpansion: 'none',
      operationsSorter: 'alpha',
    });
  }

  makeTrustedUrl(): void {
    let target = localStorage.getItem('targetUrl');
    if (target) {
      this.targetUrl = target;
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.targetUrl
      );
    }
  }

  checkParaViewSections(title: string, parentTitle?: string) {
    if (parentTitle == 'Technical Specifications') {
      return;
    }
    if((title == 'References'||title == 'Use Cases') && this.product.productTemplate.id=='TID1'){
      return true;
    }
    return (
      this.paraViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  checkListViewSections(title: string) {
    return (
      this.listViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  checkUserRoleSections(title: string) {
    return (
      this.userRolesViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  checkUserPersonaSections(title: string) {
    return (
      this.userPersonaViewSections.filter((secTitle) => {
        return secTitle === title;
      }).length > 0
    );
  }

  receiveMsg(event: any) {
    if (event) {
      this.list.forEach((item: any) => {
        if (item.comments) {
          item.comments.forEach((comment: any) => {
            if (comment.id == event) {
              item.repliesOpened = false;
            }
          });
        }
      });
    }
  }

  loadComments(change: string) {
    if (change === 'increment') {
      this.child.loadComments('increment');
    } else {
      this.child.loadComments('decrement');
    }
  }

  setAvatar(userObj: any): string {
    let avatar: string = '';
    if (userObj.createdBy && userObj.createdBy?.displayName) {
      avatar =
        userObj.createdBy.firstName.charAt(0).toUpperCase() +
        userObj.createdBy.lastName.charAt(0).toUpperCase();
    } else if (userObj.assignee && userObj.assignee?.displayName) {
      avatar =
        userObj.assignee.firstName.charAt(0).toUpperCase() +
        userObj.assignee.lastName.charAt(0).toUpperCase();
    } else {
      avatar = '';
    }
    return avatar;
  }

  eventFromConversationAction(data: { action: string; cmt: any }) {
    this.action = data.action;
    if (data.action === 'REPLY') {
      this.onClickReply(data.cmt);
    } else if (data.action === 'EDIT') {
      this.editComment(data.cmt);
    } else if (data.action === 'LINK_TO_CR') {
      this.linkToCr(data.cmt);
    } else if (data.action === 'ARCHIVE') {
      this.archiveCurrentComment(data.cmt);
    } else {
      this.unLinkToCr(data.cmt);
    }
  }

  onClickReply(cmt: any): void {
    if (!cmt.topParentId) {
      this.topParentId = cmt.id;
    }
    this.selectedComment = cmt;
    this.showCommentInput = true;
    this.action = 'REPLY';
  }

  editComment(cmt: number): void {
    this.selectedComment = cmt;
    this.showCommentInput = true;
    this.action = 'EDIT';
  }

  archiveCurrentComment(comment: string): void {
    this.selectedComment = comment;
    this.showConfirmationPopup = true;
    this.confirmarionContent =
      'Are you sure, Do you want to Archive this Comment?';
    this.confirmarionHeader = 'Archive Comment';
  }

  toggleConfirmPopup(event: boolean) {
    this.showDeletePopup = event;
  }

  archiveComment() {
    this.utils.loadSpinner(true);
    let body = { ...this.selectedComment };
    body.status = 'ARCHIVE';
    body.createdBy = this.currentUser?.userId;
    this.commentsService
      .addComments(body)
      .then((res) => {
        if (res) {
          this.utils.loadToaster({
            severity: 'success',
            summary: 'Success',
            detail: 'Comment deleted successfully',
          });
          const product: any = this.storageService.getItem(StorageKeys.Product);
          const specVersion: any = this.storageService.getItem(
            StorageKeys.SpecVersion
          );
          this.specService.getMeAllComments({
            productId: product?.id,
            versionId: specVersion?.id,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
        this.utils.loadSpinner(false);
      });
  }

  deleteTask(event: boolean) {
    this.utils.loadSpinner(true);
    this.showDeletePopup = event;
    this.commentsService
      .deletTask(this.selectedComment.id)
      .then((res) => {
        if (res) {
          this.utils.loadToaster({
            severity: 'success',
            summary: 'Success',
            detail: 'Task deleted successfully',
          });
          this.utils.updateConversationList('TASK');
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
        this.utils.loadSpinner(false);
      });
  }

  highlightMatch(conversation: string): SafeHtml {
    const regex = /@.*?,/g;
    const highlighted = conversation?.replace(regex, (match) => {
      const matchedTextWithoutComma = match.slice(0, -1);
      const spanWithId = `<span class="highlight-tags" style="color:rgb(2, 173, 238);" >${matchedTextWithoutComma}</span>`;
      return spanWithId;
    });
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  modifiedTimeDifference(modifiedOn: Date): string {
    const now = new Date();
    const modifiedTime = new Date(modifiedOn);
    const timeDifference = now.getTime() - modifiedTime.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    if (minutesDifference < 1) {
      return 'Just now';
    } else if (minutesDifference === 1) {
      return '1m ago';
    } else if (minutesDifference < 60) {
      return `${minutesDifference}m ago`;
    } else {
      const hoursDifference = Math.floor(minutesDifference / 60);
      if (hoursDifference === 1) {
        return '1h ago';
      } else {
        return `${hoursDifference}h ago`;
      }
    }
  }

  viewReplies(cmt?: any) {
    this.commentDelete = cmt;
    if (!cmt.topParentId || cmt.topParentId !== null) {
      this.topParentId = cmt.id;
    }
    this.showReplies = true;
    if (cmt) this.selectedComment = cmt;
    this.utils.loadSpinner(true);
    this.commentsService
      .getComments({ topParentId: this.selectedComment.id })
      .then((response: any) => {
        if (response && response.data) {
          this.replies = response.data.data;
          response.data.data.forEach((element: any) => {
            element.parentUser = this.list.filter((ele: any) => {
              return ele.id === this.selectedComment.id;
            })[0].createdBy;
          });
          this.list.forEach((obj: any) => {
            if (obj.id === this.selectedComment.id) {
              obj.comments = response.data.data;
              obj.repliesOpened = true;
            }
          });
          this.replies = response.data;
        } else {
          this.utils.loadToaster({
            severity: 'error',
            summary: 'Error',
            detail: response?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
      });
  }

  hideReplies(cmt?: any) {
    this.list.forEach((obj: any) => {
      if (obj.id === this.selectedComment.id) {
        obj.comments = this.replies;
        obj.repliesOpened = false;
      }
    });
  }

  linkToCr(cmt?: any) {
    if (cmt) {
      this.selectedComment = cmt;
      this.showCrPopup = true;
      this.messagingService.sendMessage({
        msgType: MessageTypes.LinkToCR,
        msgData: cmt,
      });
    }
  }

  unLinkToCr(cmt?: any) {
    this.selectedComment = cmt;
    this.showConfirmationPopup = true;
    this.confirmarionContent =
      'Are you sure, Do you want to Unlink this Comment from CR?';
    this.confirmarionHeader = 'UnLink Comment';
    this.action = 'UNLINK_CR';
  }

  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  deleteAttachment(cmt: any, index: number): void {
    this.fileIndex = index;
    this.showConfirmationPopup = true;
    this.selectedComment = cmt;
    this.confirmarionContent =
      'Are you sure, Do you want to delete this Attachment?';
    this.confirmarionHeader = 'Delete Attachment';
    this.action = 'DELETE_ATTACHMENT';
  }

  onClickConfirmationAction(event: any): void {
    if (event === 'Yes') {
      this.checkAction();
    }
    this.showConfirmationPopup = false;
  }

  checkAction(): void {
    if (this.action === 'ARCHIVE') {
      this.archiveComment();
    } else if (this.action === 'DELETE_ATTACHMENT') {
      this.deleteFile(this.selectedComment);
    } else if (this.action === 'UNLINK_CR') {
      this.deleteCrEntity();
    }
  }

  deleteCrEntity(): void {
    this.commentsService
      .deleteCrEntity({ entityType: 'COMMENT', id: this.selectedComment.id })
      .then((res: any) => {
        if (res && res.status === 200) {
          this.utils.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: 'Comment has been unlinked from CR successfully',
          });
          const product: any = this.storageService.getItem(StorageKeys.Product);
          const specVersion: any = this.storageService.getItem(
            StorageKeys.SpecVersion
          );
          this.specService.getMeAllComments({
            productId: product?.id,
            versionId: specVersion?.id,
          });
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
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }

  getMeAllCommentsList() {
    this.utils.loadSpinner(true);
    const specVersion: any = this.storageService.getItem(
      StorageKeys.SpecVersion
    );
    const product: any = this.storageService.getItem(StorageKeys.Product);
    this.commentsService
      .getCommentsByProductId({
        productId: product.id,
        versionId: specVersion?.id,
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
  deleteFile(cmt: any) {
    let latestFiles: any[] = [];
    cmt?.attachments?.map((res: any, index: number) => {
      if (index !== this.fileIndex) {
        latestFiles.push(res.fileId);
      }
    });
    cmt.attachments = latestFiles;
    this.saveComment(cmt);
  }
  saveComment(cmt: any): void {
    this.commentsService
      .addComments(cmt)
      .then((commentsReponse: any) => {
        if (commentsReponse.statusText === 'Created') {
          this.utils.loadToaster({
            severity: 'success',
            summary: 'SUCCESS',
            detail: 'File deleted successfully',
          });
          this.fileIndex = null;
          const product: any = this.storageService.getItem(StorageKeys.Product);
          const specVersion: any = this.storageService.getItem(
            StorageKeys.SpecVersion
          );
          this.specService.getMeAllComments({
            productId: product?.id,
            versionId: specVersion?.id,
          });
        } else {
          this.utils.loadSpinner(false);
          this.utils.loadToaster({
            severity: 'error',
            summary: 'ERROR',
            detail: commentsReponse?.data?.common?.status,
          });
        }
        this.utils.loadSpinner(false);
      })
      .catch((err) => {
        this.utils.loadSpinner(false);
        this.utils.loadToaster({
          severity: 'error',
          summary: 'ERROR',
          detail: err,
        });
      });
  }
  scrollToItem(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  checktableJsonSection(title: string): boolean {
    return (
      title === 'Business Rules' ||
      title === 'Functional Dependencies' ||
      title === 'Data Dictionary' ||
      title === 'User Interfaces' ||
      title === 'Annexures'
    );
  }
}
