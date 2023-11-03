import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'xnode-data-dictionary',
  templateUrl: './data-dictionary.component.html',
  styleUrls: ['./data-dictionary.component.scss']
})
export class DataDictionaryComponent implements OnInit {
  @Input() content: any;
  @Input() searchTerm: any;

  @Input() obj:any;
  selectedText:any;
  @Output() childEvent= new EventEmitter();

  ngOnInit(): void {
  }

  setColumnsToTheTable(data: any) {
    let cols;
    cols = Object.entries(data).map(([field, value]) => ({ field, header: field, value }));
    return cols
  }

  selectText(event:any){
    var text;
    if (window.getSelection) {
        text = window.getSelection()?.toString();
    } else if ((document as any).selection && (document as any).selection.type != 'Control') {
      text = (document as any).selection.createRange().text;
    }
    if(text.length>0){
      this.selectedText = text;
      this.obj.selectedText = text;
      this.obj.screenX = event.screenX;
      this.obj.screenY = event.screenY;
      this.childEvent.emit(this.obj)
    }else{
      this.selectedText = '';
      this.obj.selectedText = '';
      console.log('in else',this.obj)
      this.childEvent.emit(this.obj)
    }
  }
}
