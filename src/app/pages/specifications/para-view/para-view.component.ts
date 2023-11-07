import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild } from '@angular/core';
import { Section } from 'src/models/section';
import { OverlayPanel } from 'primeng/overlaypanel';

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
  @ViewChild('paraContentDiv')
  paraContentDiv!: ElementRef;
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
    // if(text && text?.length>0){
    //     this.selectedText = text;
    //     this.obj.selectedText = text;
    //     this.obj.screenX = event.screenX;
    //     this.obj.screenY = event.screenY;
    //     // setTimeout(() => {
    //     //   let elem = document.getElementsByClassName('p-overlaypanel')[0]
    //     //   if(elem){
    //     //     const yAxis =event.screenY; // - 100
    //     //     (elem as HTMLElement)['style'].zIndex  = '1002';
    //     //     (elem as HTMLElement)['style'].transformOrigin  = 'center top';
    //     //     (elem as HTMLElement)['style'].transform ='translateY(0px)';
    //     //     (elem as HTMLElement)['style'].opacity= '2';
    //     //     (elem as HTMLElement)['style'].top = yAxis + 'px';
    //     //     (elem as HTMLElement)['style'].left =  event.screenX + 'px';
    //     //   }
    //     // }, 800);
    //     this.childEvent.emit(this.obj)
    //   }else{
    //     this.selectedText = '';
    //     this.obj.selectedText = '';
    //     this.overlayPanel.toggle(false)
    //     this.childEvent.emit(this.obj)
    //   }

    // ====================================

    if (selection) {
        text = selection?.toString();
        this.selectedText = text;
        console.log(text, selection.rangeCount)
        if(selection.rangeCount > 0 && text.length){
          const range = selection.getRangeAt(0);
          const selectedText = selection.toString();
          const span = document.createElement('span');
          span.classList.add('selectedPara');
          // span.setAttribute(' #targetEl', '');
          span.id = 'selectedPara'+this.milliseconds;
          span.textContent = selectedText;
          let reqElem = document.getElementById('selectedPara'+this.milliseconds)
          range.deleteContents();
          range.insertNode(span);
          if(reqElem){
            reqElem.addEventListener('click', (event) => {
              console.log(event)
              setTimeout(() => {
                const rect = range.getBoundingClientRect();
                console.log('rect',rect)
                let elem = document.getElementsByClassName('p-overlaypanel')[0];
                reqElem?.parentElement?.append(this.overlayPanel);

                if(elem){
                  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                  let insetTop = (rect.top / vh)*100  + 'vh';
                  let insetRight = (rect.right  / vw) * 100 + 'vw';
                  let insetBottom = (rect.bottom / vh)*100  + 'vh';
                  let insetLeft = (rect.left  / vw) * 100 + 'vw';
                  if (rect.top < 0) {
                    insetTop = '0vh';
                  }
                  if (rect.left < 0) {
                    insetLeft = '0vw';
                  }
                  if (rect.bottom > vh) {
                    insetBottom = '100vh';
                  }
                  if (rect.right > vw) {
                    insetRight = '100vw';
                  }
                  (elem as HTMLElement & { style: { overlayArrowLeft: string } })['style']['overlayArrowLeft'] = insetLeft;
                  // (elem as HTMLElement).overlayArrowLeft= '547px';
                  // (elem as HTMLElement & { style: {[key: string]: string } })['style']['overlayArrowLeft'] = insetLeft;
                  (elem as HTMLElement)['style'].transformOrigin  = 'inherit';
                  // (elem as HTMLElement)['style'].left = rect.left + 'px';
                  // (elem as HTMLElement)['style'].top = rect.top + 'px';
                  // (elem as HTMLElement)['style'].right = rect.right+'px'; //bottom
                  // (elem as HTMLElement)['style'].bottom = rect.bottom+'px';
                  (elem as HTMLElement)['style'].inset = `${insetTop} ${insetBottom} auto`; //auto
                  // (elem as HTMLElement)['style'].left = (rect.left  / vw) * 100 + 'vw';
                  // (elem as HTMLElement)['style'].top =  (rect.top / vh)*100  + 'vh';
                  // (elem as HTMLElement)['style'].right =  (rect.right  / vw) * 100 + 'vw';
                  // (elem as HTMLElement)['style'].bottom =  (rect.bottom / vh)*100  + 'vh';
                }
              }, 750);
              this.overlayPanel.toggle(true)
              this.commentOverlayPanelOpened=true
            });
            reqElem?.click();
          }
        }else{
          this.overlayPanel.toggle(false)
          this.commentOverlayPanelOpened=false
          this.selectedText = '';
          this.refreshDiv();
        }
     }
  }

  refreshDiv(){
    this.paraContentDiv.nativeElement.innerHTML = this.content;
  }

  ngOnInit() {
    this.contentData = this.content;
  }
}
