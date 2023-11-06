import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { SECTION_VIEW_CONFIG } from '../section-view-config';
import { ApiService } from 'src/app/api/api.service';
import { User } from 'src/models/user';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'xnode-spec-sections-layout',
  templateUrl: './spec-sections-layout.component.html',
  styleUrls: ['./spec-sections-layout.component.scss']
})
export class SpecSectionsLayoutComponent implements OnInit {
  @Input() content: any;
  @Input() searchTerm: any;
  @Input() sectionIndex!: number;
  @Input() specItem: any;
  @Input() readOnly!: boolean;
  @Input() targetUrl: string = '';
  @Input() isOpenSmallCommentBox!: boolean;
  @Input() commentList: any;
  @Output() getCommentsAfterUpdate = new EventEmitter<any>();
  @Output() onClickSeeMore = new EventEmitter<any>();
  @Output() onClickSeeLess = new EventEmitter<any>();
  @Output() showAddCommnetOverlay = new EventEmitter<any>();
  @Output() expandComponent = new EventEmitter<any>();
  iframeSrc: SafeResourceUrl = '';
  @ViewChild('op')overlayPanel: OverlayPanel | any;
  position:any

  paraViewSections = SECTION_VIEW_CONFIG.listViewSections;
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;
  selectedContent: any;
  selectedSpecItem: any;
  specItemList: any;
  smallCommentContent: any;
  showMoreContent: any;
  specExpanded: any;
  checked: boolean = false;
  currentUser: any;
  usersData: any = [];
  users: any = [];
  product: any;
  selectedText:string='';
  seletedMainIndex?: number;
  selecteedSubIndex?: number;
  selecteedSubSubIndex?: number;
  showCommentIcon?: boolean;
  commentOverlayPanelOpened: boolean = false;

  constructor(private utils: UtilsService,
    private commentsService: CommentsService,
    private domSanitizer: DomSanitizer,
    private apiservice: ApiService) {
  }

  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    const product = localStorage.getItem('product');
    if (product) {
      this.product = JSON.parse(product);
    }
    this.makeTrustedUrl();
    this.getUsersData();
  }

  getUsersData() {
    this.apiservice.getAuthApi('user/get_all_users?account_id=' + this.currentUser?.account_id).then((resp: any) => {
      this.utils.loadSpinner(true);
      if (resp?.status === 200) {
        this.usersData = resp.data;
        let data = [] as any[];
        this.usersData.map((element: any) => {
          let name: string = element?.first_name;
          data.push(name)
        });
        this.users = data;
      } else {
        this.utils.loadToaster({ severity: 'error', summary: '', detail: resp.data?.detail });
      }
      this.utils.loadSpinner(false);
    }).catch((error) => {
      this.utils.loadToaster({ severity: 'error', summary: '', detail: error });
      console.error(error);
    })
  }

  makeTrustedUrl(): void {
    this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.targetUrl);
  }

  getCommentListBasedOnContentId(contentId: string) {
    this.utils.loadSpinner(true);
    this.commentsService.getComments({ contentId: contentId }).then((response: any) => {
      if (response && response.data) {
        this.utils.saveCommentList(response.data)
        this.commentList = response.data;
      }
      this.utils.loadSpinner(true);
    }).catch(err => {
      console.log(err);
      this.utils.loadSpinner(true);
    });
  }

  receiveMsg(event:any){

    console.log('at first',event)
    if(event?.selectedText.length>0){
      let obj = {
        'item':event.item,
        'content':event.content
      }
      this.toggleOverlayPanel(true, obj);
      setTimeout(() => {
        let elem = document.getElementsByClassName('p-overlaypanel')[0]
        if(elem){
          const yAxis =event.screenY - 100;
          (elem as HTMLElement)['style'].zIndex  = '1002';
          (elem as HTMLElement)['style'].transformOrigin  = 'center top';
          (elem as HTMLElement)['style'].transform ='translateY(0px)';
          (elem as HTMLElement)['style'].opacity= '2';
          (elem as HTMLElement)['style'].top = yAxis + 'px';
          (elem as HTMLElement)['style'].left =  event.screenX + 'px';
        }
      }, 1000);
    }else{
      this.toggleOverlayPanel(false);
    }
      // console.log(event)
      // console.log(this.isOpenSmallCommentBox)
      // console.log(this.content)
  }

  toggleOverlayPanel(value:boolean,obj?:any){
    if(value){
      this.isOpenSmallCommentBox = true;
      this.content.showCommentOverlay = true;
      this.onClickAddComment(obj);
      this.overlayPanel.toggle(true);
    }else{
      this.isOpenSmallCommentBox = false;
      this.content.showCommentOverlay = false;
      this.overlayPanel.toggle(false)
    }
  }

  onClickAddComment(obj: any): void {
      console.log(obj)
      console.log(this.content,this.isOpenSmallCommentBox)
      this.isOpenSmallCommentBox=true;
      this.selectedContent = obj.content;
      this.showAddCommnetOverlay.emit(obj)
  }

  selectText(event:any, object:any, id:any){
    var text;
    if (window.getSelection) {
        text = window.getSelection()?.toString();
    } else if ((document as any).selection && (document as any).selection.type != 'Control') {
      text = (document as any).selection.createRange().text;
    }
    if(text.length>0){
      this.selectedText = text;
      this.isOpenSmallCommentBox = true
      this.onClickAddComment(object)
    }else{
      this.selectedText = '';
      this.isOpenSmallCommentBox = false
      this.overlayPanel.toggle(false)
    }
  }

  sendComment(comment: any) {
    // this.utils.loadSpinner(true);
    // const body = {
    //   contentId: this.selectedContent.id,
    //   productId: this.product.id,
    //   userId: this.currentUser.user_id,
    //   message: comment,
    //   itemType: 'Comment',
    // }
    // this.commentsService.addComments(body)
    //   .then((commentsReponse: any) => {
    //     console.log('commentsReponse', commentsReponse);
    //     this.utils.commentAdded(true);
    //     this.utils.loadSpinner(false);
    //   }).catch(err => {
    //     console.log('err', err);
    //     this.utils.loadSpinner(false);
    //   })
    return

    this.utils.openOrClosePanel(SidePanel.Comments);
    let user_id = localStorage.getItem('product_email') || (localStorage.getItem('product') && JSON.parse(localStorage.getItem('product') || '{}').email)
    this.isOpenSmallCommentBox = false;
    this.commentsService.getComments(this.selectedSpecItem)
      .then((commentsReponse: any) => {
        let body: any = {
          product_id: localStorage.getItem('record_id'),
          content_id: this.selectedSpecItem.id,
        };
        if (commentsReponse && commentsReponse.data && commentsReponse.data.comments) {
          this.isOpenSmallCommentBox = false;
          body.comments = [
            ...commentsReponse['data']['comments'],
            ...[{
              user_id: user_id,
              message: comment,
            }]
          ]
        } else {
          body.comments = [{
            user_id: user_id,
            message: comment
          }]
        }
        this.commentsService.updateComments(body)
          .then((response: any) => {
            this.smallCommentContent = "";
            this.getCommentsAfterUpdate.emit(comment);
            this.utils.openOrClosePanel(SidePanel.Comments);
          })
          .catch((error: any) => {
            this.smallCommentContent = "";
          });
      })
      .catch(res => {
        console.log("comments get failed");
      })
  }

  checkedToggle(type: any, item: any, content: any) {
    this.specItemList.forEach((obj: any) => {
      if (obj.id === item.id) {
        obj.content.forEach((conObj: any) => {
          if (conObj.id === content.id && type === 'table')
            conObj.showTable = true;
          else
            conObj.showTable = false;
        })
      }
    })
  }
  checkParaViewSections(title: string) {
    return this.paraViewSections.filter(secTitle => { return secTitle === title }).length > 0;
  }
  checkListViewSections(title: string) {
    return this.listViewSections.filter(secTitle => { return secTitle === title }).length > 0;
  }


  getTestCaseKeys(testCase: any): string[] {
    return Object.keys(testCase);
  }
  isArray(item: any) {
    return Array.isArray(item);
  }
}
