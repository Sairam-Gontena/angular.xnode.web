import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CommentsService } from 'src/app/api/comments.service';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SidePanel } from 'src/models/side-panel.enum';
import { SECTION_VIEW_CONFIG } from '../section-view-config';

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
  @Input() isOpenSmallCommentBox!: boolean;
  @Output() getCommentsAfterUpdate = new EventEmitter<any>();
  @Output() onClickSeeMore = new EventEmitter<any>();
  @Output() onClickSeeLess = new EventEmitter<any>();
  @Output() onClickComment = new EventEmitter<any>();
  iframeSrc: SafeResourceUrl = '';
  paraViewSections = SECTION_VIEW_CONFIG.listViewSections;
  listViewSections = SECTION_VIEW_CONFIG.listViewSections;
  selectedContent: any;
  selectedSpecItem: any;
  specItemList: any;
  smallCommentContent: any;
  showMoreContent: any;
  specExpanded: any;
  checked: boolean = false;


  constructor(private utils: UtilsService,
    private commentsService: CommentsService) {

  }

  ngOnInit(): void {
    console.log('content', this.content);

  }

  sendComment(comment: any) {
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

  expandComponent(val: any): void {
    if (val) {
      this.selectedSpecItem = val;
      this.utils.saveSelectedSection(val);
      this.specExpanded = true;
    } else {
      this.specExpanded = false;
    }
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
