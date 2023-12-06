import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { UtilsService } from '../../../components/services/utils.service';
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
  filterOptions: Array<DropdownOptions> = [{ label: 'All Comments', value: 'all' }];
  selectedFilter: object = { label: 'All Comments', value: 'all' };
  selectedComment: any;
  list: any = [];
  product: any;

  constructor(private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private commentsService: CommentsService,
    private storageService: LocalStorageService) {
    this.product = this.storageService.getItem(StorageKeys.Product);
    this.specUtils.tabToActive.subscribe((res: any) => {
      if (res == 'COMMENT') {
        this.getMeCommentsList();
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const activeIndexChange = changes['activeIndex'] as SimpleChange;
    if (activeIndexChange && activeIndexChange.currentValue === 0) {
      this.getMeCommentsList();
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
        }
        this.utils.loadSpinner(false);
      }).catch(err => {
        console.log(err);
        this.utils.loadSpinner(false);
      });
    }
  }

}
