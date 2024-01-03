import { Component, INJECTOR, Input, OnInit, SimpleChange } from '@angular/core';
import { UtilsService } from '../../../components/services/utils.service';
import { ApiService } from 'src/app/api/api.service';
import { CommentsService } from 'src/app/api/comments.service';
import { DropdownOptions } from 'src/models/dropdownOptions';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';

@Component({
  selector: 'xnode-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss']
})

export class CommentsPanelComponent implements OnInit {
  @Input() specData?: Array<[]>;
  @Input() usersList: any;
  @Input() activeIndex: any;
  @Input() swaggerData:any;
  filterOptions: Array<DropdownOptions> = [{ label: 'All', value: 'ALL' }, { label: 'Linked', value: 'LINKED' }, { label: 'New', value: 'NEW' }, { label: 'Closed', value: 'CLOSED' }];
  selectedFilter: { label: string; value: string } = { label: 'All', value: 'ALL' };
  selectedComment: any;
  list: any = [];
  filteredList: any = []
  product: any;

  constructor(private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private commentsService: CommentsService,
    private storageService: LocalStorageService,
    private apiService:ApiService) {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.specUtils.tabToActive.subscribe((res: any) => {
      if (res == 'COMMENT') {
        this.utils.loadSpinner(true);
        this.specUtils.specConversationPanelFrom == 'spec_header'?this.ngOnInit():this.getMeCommentsList();
      }
    });
  }

  ngOnInit(): void {
    if(this.specUtils.specConversationPanelFrom == 'spec_header'){
      let spec_version = localStorage.getItem('SPEC_VERISON');
      if(spec_version){
      let data = JSON.parse(spec_version);
      let id;
      data.id ? id=data.id : id=data.versionId ;
      this.utils.loadSpinner(true);
      this.apiService.getComments('comment/comments-by-productId?productId='+data.productId+'&verisonId='+id).then((res:any)=>{
          if (res.status === 200 && res.data) {
            this.list = res.data;
            this.filterList(res.data);
          }
          this.utils.loadSpinner(false);
        }).catch((err)=>{
          console.log(err);
          this.utils.loadSpinner(false);
        })
      }
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if(this.specUtils.specConversationPanelFrom == ''){
      const activeIndexChange = changes['activeIndex'] as SimpleChange;
      if (activeIndexChange && activeIndexChange.currentValue === 0) {
        this.utils.loadSpinner(true);
        let specData = localStorage.getItem('selectedSpec');
        if(specData)
        this.getMeCommentsList();
      }
    }
  }

  getMeCommentsList() {
    this.utils.loadSpinner(true);
    let specData = localStorage.getItem('selectedSpec');
    let selectedSpec: any;
    if (specData) {
      selectedSpec = JSON.parse(specData);
      this.commentsService.getComments({ parentId: selectedSpec.id, isReplyCountRequired: true }).then((response: any) => {
        if (response.status === 200 && response.data) {
          this.list = response.data;
          this.filterList(response.data)
        }
        this.utils.loadSpinner(false);
      }).catch(err => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
    }
  }

  filterList(data: any): void {
    this.filteredList =[]
    switch (this.selectedFilter.value) {
      case 'LINKED':
        this.filteredList = data.filter((item: any) => item.status === 'LINKED');
        break;
      case 'NEW':
        this.filteredList = data.filter((item: any) => item.status === 'NEW');
        break;
      case 'CLOSED':
        this.filteredList = data.filter((item: any) => item.status === 'CLOSED');
        break;
      default:
        this.filteredList = data;
        break;
    }
  }

}
