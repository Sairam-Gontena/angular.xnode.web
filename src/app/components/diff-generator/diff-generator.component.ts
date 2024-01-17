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
    this.getDiff();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.propHasChanged(changes['left']) ||
      this.propHasChanged(changes['right'])
    ) {
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
    this.oldContent = `The Minister said he explained to his Chinese counterpart that "unless a solution is found at the border, they should not expect other relations to move on normally".
    "That is impossible. You don't want to fight and do trade at the same time. Meanwhile, diplomacy is going on and sometimes solutions to difficult situations do not come in haste," he asserted.`;

    this.newContent = `The Minister said he explained to his Chinese party that "unless a solution is found at the border, they should not expect other relations to move on normally".
    "That is impossible. You don't want to fight and do trade at the same time. Meanwhile, diplomacy is going on and sometimes solutions to difficult situations do not come in haste," he assured.`;

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
