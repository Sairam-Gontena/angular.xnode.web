import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DiffToHtmlService } from '../diff-generator/diff-to-html.service';
import Quill from 'quill';

@Component({
  selector: 'xnode-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextEditorComponent implements OnInit {
  oldText: string | undefined;
  newText: string | undefined;

  editor1!: Quill;
  editor2!: Quill;
  constructor(private diffService: DiffToHtmlService) {
  }

  ngOnInit(): void {}

  initializerEditor1(event:any){
    this.editor1 = event.editor;
  }

  initializerEditor2(event:any){
    this.editor2 = event.editor;
  }


  generateDiff() {
    var oldContent = this.editor1.getContents();
    var newContent = this.editor2.getContents();
    var diff = oldContent.diff(newContent);
    console.log('old', oldContent);
    console.log('new', newContent);
    for (var i = 0; i < diff.ops.length; i++) {
      var op = diff.ops[i];
      // if the change was an insertion
      if (op.hasOwnProperty('insert')) {
        // color it green
        op.attributes = {
          background: "#cce8cc",
          color: "#003700"
        };
      }
      // if the change was a deletion
      if (op.hasOwnProperty('delete')) {
        // keep the text
        op.retain = op.delete;
        delete op.delete;
        // but color it red and struckthrough
        op.attributes = {
          background: "#e8cccc",
          color: "#370000",
          strike: true
        };
      }
    }
    console.log('diff', diff);
    var adjusted = oldContent.compose(diff);
    console.log('adjusted', adjusted);

    // profit!
    this.editor2.setContents(adjusted);
  }
}
