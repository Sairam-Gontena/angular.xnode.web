import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Section } from 'src/models/section';

@Component({
  selector: 'xnode-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {
  @Input() content!: Array<Section>;
  @Input() searchTerm!: string;
  @Input() obj!: {[key: string]: string};
  selectedText:any;
  @Output() childEvent= new EventEmitter();
  @Input() selectedContent!: string;
  @Input() users: any = [];
  showCommentIcon: boolean = false;
  selectedIndex?: number;
  commentOverlayPanelOpened: boolean = false;


  onTextSelected(event: MouseEvent) {
    const selectedText = this.getSelectedText();
    if (selectedText) {
      console.log('Selected Text: ' + selectedText);
      // You can now do something with the selected text.
    }
  }

  ngOnInit(){
  }

  private getSelectedText() {
    const text = window.getSelection()?.toString();
    return text ? text.trim() : null;
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
      this.obj['selectedText']= text;
      this.obj['screenX'] = event.screenX;
      this.obj['screenY'] = event.screenY;
      this.childEvent.emit(this.obj)
    }else{
      this.selectedText = '';
      this.obj['selectedText']= text;
      console.log('in else',this.obj)
      this.childEvent.emit(this.obj)
    }
  }
}


