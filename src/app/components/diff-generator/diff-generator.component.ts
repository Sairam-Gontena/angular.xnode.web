import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  Output,
  EventEmitter,
} from '@angular/core';
import { DiffToHtmlService } from './diff-to-html.service';
import { DiffFormat, DiffStyle } from './diff-to-html.model';

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
  @Input() private filename: string = '';
  @Input() format?: DiffFormat;
  @Input() private style: DiffStyle = 'word';
  @Output() diffChange: EventEmitter<string> = new EventEmitter();
  private diff: string = '';
  diffHTML: string = '';

  constructor(private diffService: DiffToHtmlService) { }

  ngOnInit() {
    // this.getDiff();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['oldContent']?.currentValue) {
      this.oldContent = changes['oldContent']?.currentValue;
    }
    if (changes['format']?.currentValue) {
      this.format = changes['format']?.currentValue;
    }
    if (changes['newContent']?.currentValue) {
      this.newContent = changes['newContent']?.currentValue;
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
    // if (
    //   this.propHasChanged(changes['oldContent']) ||
    //   this.propHasChanged(changes['newContent'])
    // ) {
    //   this.newContent = changes['newContent'].currentValue;
    //   this.getDiff();
    // } else if (
    //   this.propHasChanged(changes['style']) ||
    //   this.propHasChanged(changes['format'])
    // ) {
    //   this.refreshDiffHTML();
    // }
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
}
