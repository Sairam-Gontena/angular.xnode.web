import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild } from '@angular/core';
import { Section } from 'src/models/section';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'xnode-para-view',
  templateUrl: './para-view.component.html',
  styleUrls: ['./para-view.component.scss']
})
export class ParaViewComponent {
  @Input() searchTerm!: string;
  @Input() content!: Section; //!: Section
  @Input() selectedContent!: string;
  @Input() users: any = [];
  @Input() obj:any;
  contentData:any;
  @Output() childEvent= new EventEmitter();

  @ViewChild('op')overlayPanel: OverlayPanel | any;
  selectedText:string = '';
  showCommentIcon: boolean = false;
  commentOverlayPanelOpened:boolean=false

  constructor() {
  }
  selectText(event:any){
    var text;
    const selection = window.getSelection();
    text = selection?.toString();
    console.log('window.getSelection', text)
    if(text && text?.length>0 && selection){
        this.selectedText = text;
        this.obj.selectedText = text;
        this.obj.screenX = event.screenX;
        this.obj.screenY = event.screenY;
        const range = selection.getRangeAt(0);
        this.obj.rect = range.getBoundingClientRect();
        this.childEvent.emit(this.obj)
      }else{
        this.selectedText = '';
        this.obj.selectedText = '';
        this.childEvent.emit(this.obj)
      }
  }

  ngOnInit() {
    this.contentData = this.content;
  }
}
