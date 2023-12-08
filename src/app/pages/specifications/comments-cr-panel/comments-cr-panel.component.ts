import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SidePanel } from 'src/models/side-panel.enum';
import { CommentsService } from 'src/app/api/comments.service';
import { Comment } from 'src/models/comment';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { UtilsService } from 'src/app/components/services/utils.service';
import { CrTabsComponent } from 'src/app/cr-tabs/cr-tabs.component';
import { TabView } from 'primeng/tabview';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';

@Component({
  selector: 'xnode-comments-cr-panel',
  templateUrl: './comments-cr-panel.component.html',
  styleUrls: ['./comments-cr-panel.component.scss']
})
export class CommentsCrPanelComponent implements OnInit {
  @ViewChild(CrTabsComponent, { static: true })
  child!: CrTabsComponent;
  @ViewChild(TabView)
  tabView!: TabView;
  @Input() specData?: Array<[]>;
  @Input() usersList: any;
  userImage?: any = "DC";
  username?: any;
  filterOptions: Array<DropdownOptions> = [{ label: 'All Comments', value: 'all' }];
  selectedFilter: string = 'All Comments';
  @Input() list: Array<Comment> = [];
  commentObj: any = {
    comment: '',
    role: '',
    user_id: ''
  };
  comment: any;
  currentUser: any;
  activeIndex: number = 0;

  constructor(private utils: UtilsService,
    private specUtils: SpecUtilsService) {
  }

  ngOnInit(): void {
    this.specUtils.getMeCommentsCrActiveTab.subscribe((res)=>{
      if(res){
        this.activeIndex =1;
        this.child.getCRList();
      }else{
        this.activeIndex =0;
      }
    })
  }

  ngOnDestroy(): void {
    localStorage.removeItem('deep_link_info');
  }

  onClickClose() {
    this.specUtils._openCommentsPanel(false);
    this.utils.saveSelectedSection(null);
  }

  onClickEnter(event: KeyboardEventInit) {
    if (event.key === 'Enter' && this.comment.trim().length !== 0) {
      this.onClickSend()
    }
  }

  onClickSend() {
    this.commentObj.comment = this.comment;
    this.commentObj.role = 'user';
    this.commentObj.user_id = this.currentUser.id;
    this.list.push(this.commentObj);
  }

  switchHeaders(event: any) {
    this.activeIndex = event.index
    const tabs = this.tabView.tabs;
    const header = tabs[event.index].header;
    if (header == 'Change Request') {
      this.child.getCRList();
    }else{
      this.specUtils._commentsCrActiveTab(false);
      this.specUtils._tabToActive('COMMENT');
    }
  }
}
