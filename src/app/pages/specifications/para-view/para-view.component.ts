import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Section } from 'src/models/section';

@Component({
  selector: 'xnode-para-view',
  templateUrl: './para-view.component.html',
  styleUrls: ['./para-view.component.scss']
})
export class ParaViewComponent {
  @Input() searchTerm!: string;
  @Input() content!: Section;
  @Input() obj:any;
  @Output() childEvent= new EventEmitter();

  selectedText:string = '';

  ngOnInit(){
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
