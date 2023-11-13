import { Component, Input, ViewChild } from '@angular/core';
import { Section } from 'src/models/section';
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
  @Input() users: any = [];
  @Input() selectedContent!: string;
  @Input() id: any;
  @Input() specId :any;
  selectedText:string='';
  @Input() specItem: any;
  showCommentIcon: boolean = false;
  commentOverlayPanelOpened:boolean=false;
  @ViewChild('op')overlayPanel: OverlayPanel | any;
  @ViewChild('selectionText')selectionText: OverlayPanel | any;

  constructor(public utils: UtilsService){
  }

  ngOnInit(){
  }

  getWords(subitem: any){
    if (typeof subitem.content === 'string') {
      return subitem.content.split(' ');
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

  contentSelected(event:any) {
    const selectedText = this.getSelectedText();
    if (selectedText === undefined) {
      return ;
    }
    if(selectedText && selectedText.length>0 ){
      this.selectedText = selectedText
     }else{
      this.selectedText='';
     }
     this.handleSelectionText(event);
  }

  async handleSelectionText(event: any) {
    if (this.selectedText.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await this.selectionText.toggle(event);
      console.log('final console', {
        'selected Text': this.selectedText.replace(/\n/g, ' '),
        'spec with content id': this.specId,
        'spec heading id': Math.floor(this.specId),
        'id': this.specId,
      });
    }
  }

  private getSelectedText() {
    const text = window.getSelection()?.toString();
    return text;
  }
}
