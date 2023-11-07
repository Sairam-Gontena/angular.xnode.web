import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Section } from 'src/models/section';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'xnode-para-view',
  templateUrl: './para-view.component.html',
  styleUrls: ['./para-view.component.scss']
})
export class ParaViewComponent {
  @Input() searchTerm!: string;
  @Input() content: any; //!: Section
  @Input() selectedContent!: string;
  @Input() users: any = [];
  @Input() obj:any;
  @Output() childEvent= new EventEmitter();

  @ViewChild('op')overlayPanel: OverlayPanel | any;
  selectedText:string = '';
  showCommentIcon: boolean = false;
  commentOverlayPanelOpened:boolean=false
  milliseconds: number;

  constructor() {
    this.milliseconds = new Date().getMilliseconds();
  }
  selectText(event:any,id:any){
    var text;
    console.log(event)
    const selection = window.getSelection();
    text = selection?.toString();
    if(text && text?.length>0){
        this.selectedText = text;
        this.obj.selectedText = text;
        this.obj.screenX = event.screenX;
        this.obj.screenY = event.screenY;
        // setTimeout(() => {
        //   let elem = document.getElementsByClassName('p-overlaypanel')[0]
        //   if(elem){
        //     const yAxis =event.screenY; // - 100
        //     (elem as HTMLElement)['style'].zIndex  = '1002';
        //     (elem as HTMLElement)['style'].transformOrigin  = 'center top';
        //     (elem as HTMLElement)['style'].transform ='translateY(0px)';
        //     (elem as HTMLElement)['style'].opacity= '2';
        //     (elem as HTMLElement)['style'].top = yAxis + 'px';
        //     (elem as HTMLElement)['style'].left =  event.screenX + 'px';
        //   }
        // }, 800);
        this.childEvent.emit(this.obj)
      }else{
        this.selectedText = '';
        this.obj.selectedText = '';
        this.overlayPanel.toggle(false)
        this.childEvent.emit(this.obj)
      }
    // if (selection) {
    //     text = selection?.toString();
    //     this.selectedText = text;
    //     console.log(text, selection.rangeCount)
    //     if(selection.rangeCount > 0 && text.length){
    //       const range = selection.getRangeAt(0);
    //       const selectedText = selection.toString();
    //       const span = document.createElement('span');
    //       span.classList.add('selectedPara');
    //       span.id = 'selectedPara'+this.milliseconds;
    //       span.textContent = selectedText;
    //       let reqElem = document.getElementById('selectedPara'+this.milliseconds)
    //       range.deleteContents();
    //       range.insertNode(span);
    //       if(reqElem){
    //         reqElem.addEventListener('click', (event) => {
    //           console.log(event)
    //           this.overlayPanel.toggle(true)
    //         });
    //         reqElem?.click;
    //       }
    //     }else{
    //       this.overlayPanel.toggle(false)
    //       this.selectedText = '';
    //       this.refreshDiv();
    //       this.overlayPanel.toggle(false)
    //     }
    //  }
  }

  refreshDiv(){
    const div = document.getElementById('paraContentDiv');
    console.log('hi in refresh')
    if(div)
      div.innerHTML = this.content;
  }
}
