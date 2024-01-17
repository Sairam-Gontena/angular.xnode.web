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
  @Input() newContent: string = '';
  @Input() oldContent: string = '';
  @Input() onDiff: boolean = false;
  @Input() private filename: string = '';
  @Input() private format: DiffFormat = 'side-by-side';
  @Input() private style: DiffStyle = 'word';
  @Output() diffChange: EventEmitter<string> = new EventEmitter();
  private diff: string = '';
  diffHTML: string = '';

  constructor(private diffService: DiffToHtmlService) {}

  ngOnInit() {
    // this.getDiff();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(
    //   'changes>>>>>>>>>>>>>>>>>>>>>',
    //   changes['oldContent'],
    //   this.oldContent
    // );
    // console.log(
    //   'changes>>>>>>>>$$$$$$$$$$>>>>>>>>>>>>>',
    //   changes['newContent']
    // );

    if (
      this.propHasChanged(changes['oldContent']) ||
      this.propHasChanged(changes['newContent'])
    ) {
      this.newContent = changes['newContent'].currentValue;
      this.getDiff();
    } else if (
      this.propHasChanged(changes['style']) ||
      this.propHasChanged(changes['format'])
    ) {
      this.refreshDiffHTML();
    }
  }

  private propHasChanged(change: SimpleChange) {
    return (
      change &&
      !change.isFirstChange() &&
      change.currentValue !== change.previousValue
    );
  }

  getDiff() {
    console.log('newContent', this.newContent);
    console.log('oldContent', this.oldContent);
    this.diff = this.diffService.getDiff(
      this.oldContent || '',
      this.newContent || '',
      this.filename
    );
    this.refreshDiffHTML();
    this.diffChange.emit(this.diff);
  }

  refreshDiffHTML() {
    this.diffHTML = this.diffService.diffToHTML(
      this.diff,
      this.format,
      this.style
    );
  }
}
