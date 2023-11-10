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
  @Input() content!: Section;
  @Input() selectedContent!: string;
  @Input() users: any = [];
  @Input() id: any;
  @Input() specId :any;
  selectedText:string='';
  showCommentIcon: boolean = false;
  commentOverlayPanelOpened:boolean=false;
  @ViewChild('op')overlayPanel: OverlayPanel | any;
  @ViewChild('selectionText')selectionText: OverlayPanel | any;

  constructor(public utils: UtilsService){
  }

  ngOnInit(){
  }

  getWords(subitem: any){
    if (typeof subitem === 'string') {
      return subitem.split(' ');
    } else if(typeof subitem === undefined){
      if(typeof subitem === 'string'){
        return subitem.split(' ');
      }
    }else if(typeof subitem === 'object'){
      if(subitem.hasOwnProperty('content')){
        return subitem.content
      }else{
        return subitem
      }
    }else {
      return [];
    }
  }


  alter(event:any) {
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
      if(this.selectedText.length>0){
        this.selectionText.toggle(event)
        console.log('final console',{
          'selected Text': this.selectedText.replace(/\n/g, ' '),
          'spec with content id': this.specId,
          'spec heading id':Math.floor(this.specId),
          'id':this.specId })
      }
     }, 500);
  }

  private getSelectedText() {
    const text = window.getSelection()?.toString();
    return text;
  }

}
