import { Component, Input, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Section } from 'src/models/section';

@Component({
  selector: 'xnode-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {
  @Input() content!: Array<Section>;
  @Input() searchTerm!: string;
  @Input() selectedContent!: string;
  @Input() users: any = [];
  @Input() id: any;
  @Input() specId :any;
  @Input() specItem: any;
  showCommentIcon: boolean = false;
  selectedIndex?: number;
  selectedText:string='';
  commentOverlayPanelOpened: boolean = false;
  @ViewChild('op')overlayPanel: OverlayPanel | any;
  @ViewChild('selectionText')selectionText: OverlayPanel | any;

  ngOnInit():void{
  }

  getWords(subitem: any){
    if (typeof subitem.content === 'string') {
      return subitem.content.split(' ');
    } else if(typeof subitem === 'string'){
      return subitem.split(' ');
    }else if(typeof subitem.content === undefined){
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
    return text ? text.trim() : null;
  }
}


