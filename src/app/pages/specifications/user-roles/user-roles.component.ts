import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'xnode-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  @Input() content: any;
  @Input() searchTerm: any;
  @Input() obj:any;
  selectedText:any;
  @Output() childEvent= new EventEmitter();
  ngOnInit(): void {
  }

  isArray(item: any) {
    return Array.isArray(item);
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
