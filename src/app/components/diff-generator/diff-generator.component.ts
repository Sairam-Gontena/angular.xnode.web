import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { DiffToHtmlService } from './diff-to-html.service';
import { DiffFormat, DiffStyle } from './diff-to-html.model';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'xnode-diff-generator',
  templateUrl: './diff-generator.component.html',
  styleUrls: ['./diff-generator.component.scss'],
})
export class DiffGeneratorComponent implements OnInit, OnChanges {
  @Input() type: string = '';
  @Input() newContent: string = '';
  @Input() oldContent: string = '';
  @Input() onDiff: boolean = false;
  @Input() keyword:any;
  @Input() private filename: string = '';
  @Input() format?: DiffFormat;
  @Input() private style: DiffStyle = 'word';
  @Input() objId:any;
  @Input() removeselectedContent:any;
  @Output() diffChange: EventEmitter<string> = new EventEmitter();
  @ViewChild('selectionText') selectionText: OverlayPanel | any;
  @Output() selectedContent: EventEmitter<any> = new EventEmitter();
  private diff: string = '';
  diffHTML: string = '';
  selectedText: string = '';
  selectedWordIndices: number[] = [];
  content:any;
  openOverlayPanel: boolean = false;

  constructor(private diffService: DiffToHtmlService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['oldContent']?.currentValue) {
      this.oldContent = changes['oldContent']?.currentValue;
      this.content =  this.oldContent;
    }
    if (changes['format']?.currentValue) {
      this.format = changes['format']?.currentValue;
    }
    if (changes['objId']?.currentValue) {
      this.objId = changes['objId']?.currentValue;
    }
    if (changes['newContent']?.currentValue) {
      this.newContent = changes['newContent']?.currentValue;
    }
    if (changes['removeselectedContent']?.currentValue==false||changes['removeselectedContent']?.currentValue==true) {
      this.selectedText= '';
      this.selectedWordIndices= [];
      this.removeselectedContent = false;
    }
    if (
      this.oldContent &&
      this.newContent &&
      this.oldContent === this.newContent
    ) {
      this.onDiff = false;
    } else {
      if (this.oldContent && this.newContent) {
        this.getDiff();
      }
    }
    // console.log('new>>', this.newContent);
    // console.log('old>>', this.oldContent);
  }

  private propHasChanged(change: SimpleChange) {
    return (
      change &&
      !change.isFirstChange() &&
      change.currentValue !== change.previousValue
    );
  }

  getDiff() {
    this.diff = this.diffService.getDiff(
      this.oldContent || '',
      this.newContent || '',
      this.filename
    );
    this.refreshDiffHTML();
    // console.log('#####', this.diff, typeof this.diff);

    this.diffChange.emit(this.diff);
  }

  refreshDiffHTML() {
    this.diffHTML = this.diffService.diffToHTML(
      this.diff,
      this.format,
      this.style
    );
    // console.log('this.diffHTMLthis.diffHTMLthis.diffHTML', this.diffHTML);
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

  contentSelected(event: any) {
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
    this.handleSelectionText(event);
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
          const index = parseInt(element.id.replace('word', ''));
          this.selectedWordIndices.push(index);
        }
      } else {
        elements.forEach((element) => {
          const id = element.id;
          const index = parseInt(id.replace('word', ''));
          if (!this.selectedWordIndices.includes(index)) {
            this.selectedWordIndices.push(index);
          }
        });
      }
    }
  }

  private getSelectedText() {
    const text = window.getSelection()?.toString();
    return text;
  }

  async handleSelectionText(event: any) {
    if (this.selectedText.length > 0) {
      let selectedContentObj = {
        content: this.selectedText,
        id:this.objId,
        event:event
      }
    this.selectedContent.emit(selectedContentObj);
    }
  }

  saveSecInLocal() {
    localStorage.setItem('selectedSpec', JSON.stringify(this.oldContent));
  }
}
