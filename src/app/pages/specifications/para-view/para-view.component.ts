import { Component, Input, ViewChild } from '@angular/core';
import { Section } from 'src/models/section';
import { UtilsService } from 'src/app/components/services/utils.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { LocalStorageService } from 'src/app/components/services/local-storage.service';
import { StorageKeys } from 'src/models/storage-keys.enum';
import { SpecUtilsService } from 'src/app/components/services/spec-utils.service';
@Component({
  selector: 'xnode-para-view',
  templateUrl: './para-view.component.html',
  styleUrls: ['./para-view.component.scss']
})
export class ParaViewComponent {
  @Input() searchTerm!: string;
  @Input() content!: Section;
  @Input() users: any = [];
  @Input() selectedContent!: string;
  @Input() id: any;
  @Input() specId: any;
  @Input() visible: any;
  @Input() reveiwerList: any;
  selectedText: string = '';
  @Input() specItem: any;
  showCommentIcon: boolean = false;
  @ViewChild('op') overlayPanel: OverlayPanel | any;
  @ViewChild('selectionText') selectionText: OverlayPanel | any;
  selectedWordIndices: number[] = [];
  currentUser: any;
  @Input() showComments: any;
  showAddTask: boolean = false;

  constructor(public utils: UtilsService, private storageService: LocalStorageService, private specUtils: SpecUtilsService) {
  }

  ngOnInit() {
    this.currentUser = this.storageService.getItem(StorageKeys.CurrentUser)
    this.utils.clearSelectedContent.subscribe((res: boolean) => {
      if (res) {
        this.emptySelectedContent();
      }
    })
    this.showComments = this.showComments;
  }

  getWords(subitem: any): string[] {
    if (typeof subitem === 'object' && subitem !== null) {
      if (typeof subitem.content === 'string') {
        return subitem.content.split(' ');
      } else if (Array.isArray(subitem.content)) {
        return subitem.content;
      } else {
        return [subitem.toString()];
      }
    } else if (typeof subitem === 'string') {
      return subitem.split(' ');
    } else {
      return [];
    }
  }
  // getWords(subitem: any) {
  //   if (typeof subitem.content === 'string') {
  //     return subitem.content.split(' ');
  //   } else if (typeof subitem === undefined) {
  //     if (typeof subitem === 'string') {
  //       return subitem.split(' ');
  //     }
  //   } else if (typeof subitem === 'object') {
  //     if (subitem.hasOwnProperty('content')) {
  //       return subitem.content
  //     } else {
  //       return subitem
  //     }
  //   } else {
  //     return [];
  //   }
  // }

  contentSelected(event: any) {
    this.showCommentIcon = true;
    this.utils.changeSelectContentChange(true)
    this.highlightSelectedText();
    const selectedText = this.getSelectedText();
    if (selectedText === undefined) {
      return;
    }
    if (selectedText && selectedText.length > 0) {
      this.selectedText = selectedText.replace(/\n/g, ' ')
    } else {
      this.selectedText = '';
    }
    this.handleSelectionText(event);
  }

  highlightSelectedText() {
    const selection = window.getSelection();
    this.selectedWordIndices = [];
    if (selection) {
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const elements = range.cloneContents().querySelectorAll('span');
      elements.forEach(element => {
        const id = element.id;
        const index = parseInt(id.replace('word', ''));
        if (!this.selectedWordIndices.includes(index)) {
          this.selectedWordIndices.push(index);
        }
      });
    }
  }

  emptySelectedContent() {
    this.selectedText = '';
    this.selectedWordIndices = [];
  }

  async handleSelectionText(event: any) {
    if (this.selectedText.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await this.selectionText.toggle(event);
    }
  }

  deSelect() {
    if (window.getSelection) {
      window.getSelection()?.empty();
      window.getSelection()?.removeAllRanges();
      this.selectedWordIndices = [];
    }
  }

  private getSelectedText() {
    const text = window.getSelection()?.toString();
    return text;
  }

  saveSecInLocal() {
    localStorage.setItem('selectedSpec', JSON.stringify(this.specItem));
  }

  openCommentSection() {
    this.specUtils._openCommentsPanel(false);
    this.utils.saveSelectedSection(null);
    localStorage.setItem('selectedSpec', JSON.stringify(this.specItem));
    setTimeout(() => {
      this.specUtils._openCommentsPanel(true);
    },);
  }
  toggleAddTask() {
    this.showAddTask = !this.showAddTask;
  }
}
