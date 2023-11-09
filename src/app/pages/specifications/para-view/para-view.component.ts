import { Component, ElementRef, Input, NgZone, Renderer2, ViewChild } from '@angular/core';
import { Section } from 'src/models/section';
import { OverlayModule } from '@angular/cdk/overlay';
import { UtilsService } from 'src/app/components/services/utils.service';
import { OverlayPanel } from 'primeng/overlaypanel';
@Component({
  selector: 'xnode-para-view',
  templateUrl: './para-view.component.html',
  styleUrls: ['./para-view.component.scss']
})
export class ParaViewComponent {
  @Input() searchTerm!: string;
  @Input() content:any;//!: Section;
  @Input() selectedContent!: string;
  @Input() users: any = [];
  selectedText:string='';
  milliseconds:any;
  showCommentIcon: boolean = false;
  commentOverlayPanelOpened:boolean=false;
  @ViewChild('op')overlayPanel: OverlayPanel | any;
  @ViewChild('selectionText')selectionText: OverlayPanel | any;
  paraContentDiv!: ElementRef;

  constructor(public utils: UtilsService,private renderer: Renderer2,private ngZone:NgZone){
    this.milliseconds = new Date().getMilliseconds();
  }


  alter(event:any) {
    console.log(event)
    const selectedText = this.getSelectedText();
    if (selectedText === undefined) {
      return ;
    }
    if(selectedText && selectedText.length>0 ){
      this.selectedText = selectedText
     }else{
      this.selectedText='';
     }
     setTimeout(() => {
      this.selectionText.toggle(event)
      console.log(this.selectedText)
     }, 500);
  }

  private getSelectedText() {
    const text = window.getSelection()?.toString();
    return text;
  }

  refreshDiv(){
    const div = document.getElementById('paraContentDiv');
    if(div)
      div.innerHTML = this.content;
    this.paraContentDiv.nativeElement.innerHTML = this.content;
  }
}
