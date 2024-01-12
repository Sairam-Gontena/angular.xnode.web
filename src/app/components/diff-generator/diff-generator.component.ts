// import { Component, Input, OnInit } from '@angular/core';

// @Component({
//   selector: 'xnode-diff-generator',
//   templateUrl: './diff-generator.component.html',
//   styleUrls: ['./diff-generator.component.scss'],
// })
// export class DiffGeneratorComponent implements OnInit {
//   @Input() newContent: string = '';
//   @Input() oldContent: string = '';
//   @Input() onDiff: boolean = false;
//   constructor() {
//     // console.log('onDiff constructor',this.onDiff)
//     // console.log('oldContent',this.oldContent)
//     // console.log('newContent',this.newContent)
//   }
//   ngOnInit(): void {
//     // console.log('onDiff ngOnInit',this.onDiff)
//     // console.log('oldContent',this.oldContent)
//     // console.log('newContent',this.newContent)
//   }
// }

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
import { NgxDiff2htmlService } from './ngx-diff2html.service';
import { DiffFormat, DiffStyle } from './ngx-diff2html.model';

@Component({
  selector: 'xnode-diff-generator',
  templateUrl: './diff-generator.component.html',
  styleUrls: ['./diff-generator.component.scss'],
})
export class DiffGeneratorComponent implements OnInit, OnChanges {
  @Input() newContent: string = '';
  @Input() oldContent: string = '';
  @Input() onDiff: boolean = false;
  @Input() private left: string = '';
  @Input() private right: string = '';
  @Input() private filename: string = '';
  @Input() private format: DiffFormat = 'line-by-line';
  @Input() private style: DiffStyle = 'word';
  @Output() diffChange: EventEmitter<string> = new EventEmitter();
  private diff: string = '';
  diffHTML: string = '';

  constructor(private diffService: NgxDiff2htmlService) {}

  ngOnInit() {
    this.getDiff();
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes);
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
    this.diff = this.diffService.getDiff(this.left, this.right, this.filename);
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
