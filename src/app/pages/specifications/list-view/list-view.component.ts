import { Component, Input, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Section } from 'src/models/section';
import { UtilsService } from 'src/app/components/services/utils.service';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
import { delay, of } from 'rxjs';
import { CommentsService } from 'src/app/api/comments.service';

@Component({
  selector: 'xnode-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent {
  @Input() parentTitle: any;
  @Input() content!: any;
  @Input() searchTerm!: string;
  @Input() selectedContent!: string;
  @Input() users: any = [];
  @Input() id: any;
  @Input() specId: any;
  @Input() specItem: any;
  @Input() visible: any;
  @Input() reveiwerList: any;

  openOverlayPanel: boolean = false;
  showCommentIcon: boolean = false;
  selectedIndex?: number;
  selectedText: string = '';
  commentOverlayPanelOpened: boolean = false;
  @ViewChild('op') overlayPanel: OverlayPanel | any;
  @ViewChild('selectionText') selectionText: OverlayPanel | any;
  @ViewChild('selectionContent') selectionContent: OverlayPanel | any;
  selectedWordIndices: any[] = [];
  showAddTask: boolean = false;

  constructor(
    private utils: UtilsService,
    private specUtils: SpecUtilsService,
    private commentsService: CommentsService
  ) { }

  ngOnInit(): void {
    this.utils.clearSelectedContent.subscribe((res: boolean) => {
      if (res) {
        this.emptySelectedContent();
      }
    });
      }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  getWords(subitem: any) {
    if (typeof subitem.content === 'string') {
      return subitem.content.split(' ');
    } else if (typeof subitem === 'string') {
      return subitem.split(' ');
    } else if (typeof subitem.content === undefined) {
      if (typeof subitem === 'string') {
        return subitem.split(' ');
      }
    } else if (typeof subitem === 'object') {
      if (subitem.hasOwnProperty('content')) {
        return subitem.content;
      } else {
        return subitem;
      }
    } else {
      return [];
    }
  }

  emptySelectedContent() {
    this.selectedText = '';
    this.selectedWordIndices = [];
  }

  deSelect() {
    if (window.getSelection) {
      window.getSelection()?.empty();
      window.getSelection()?.removeAllRanges();
      this.selectedWordIndices = [];
    }
  }

  contentSelected(event: any, type: string) {
    this.utils.changeSelectContentChange(true);
    this.highlightSelectedText();
    const selectedText = this.getSelectedText();
    if (selectedText === undefined) {
      return;
    }
    if (selectedText && selectedText.length > 0) {
      this.selectedText = selectedText.replace(/\n/g, ' ');
    } else {
      this.selectedText = '';
    }
    this.handleSelectionText(event, type);
  }

  highlightSelectedText() {
    const selection = window.getSelection();
    this.selectedWordIndices = [];
    if (selection) {
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const elements = range.cloneContents().querySelectorAll('span');
      if (elements.length === 0) {
        const element = range.startContainer.parentElement;
        if (element && element.id.startsWith('word')) {
          const index = element.id; // change this line to get the correct index
          this.selectedWordIndices.push(index);
        }
      } else {
        elements.forEach((element) => {
          const id = element.id;
          let index = id; // change this line to get the correct index
          if (!this.selectedWordIndices.includes(index)) {
            this.selectedWordIndices.push(index);
          }
        });
      }
    }
  }

  onOverlayHide() {
    this.openOverlayPanel = false;
    of([])
      .pipe(delay(1000))
      .subscribe((results) => {
        if (this.overlayPanel.overlayVisible) {
        } else {
          this.checkOverlay();
        }
      });
  }
  checkOverlay() {
    if (this.openOverlayPanel == false) {
      this.deSelect();
    }
  }

  async handleSelectionText(event: any, type: string) {
    if (this.selectedText.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (type == 'title') {
        await this.selectionText.toggle(event);
      } else if (type == 'content') {
        await this.selectionContent.toggle(event);
      }
    }
  }

  private getSelectedText() {
    const text = window.getSelection()?.toString();
    return text; // ? text.trim() : null;
  }

  saveSecInLocal() {
    localStorage.setItem('selectedSpec', JSON.stringify(this.specItem));
  }

  openCommentSection() {
    this.utils.saveSelectedSection(null);
    localStorage.setItem('selectedSpec', JSON.stringify(this.specItem));
    of([])
      .pipe(delay(500))
      .subscribe((results) => {
        this.specUtils._openCommentsPanel(true);
      });
    this.specUtils._tabToActive('COMMENT');
    this.getMeSpecLevelCommentsList()
  }
  toggleAddTask() {
    this.showAddTask = !this.showAddTask;
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
            this.specUtils._getMeUpdatedComments(response.data);
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
