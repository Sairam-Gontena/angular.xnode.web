import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
@Component({
  selector: 'xnode-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  @Input() content: any;
  @Input() searchTerm: any;
  @Input() selectedContent!: string;
  @Input() users: any = [];
  @Input() specId :any;
  @Input() specItem: any;
  showCommentIcon: boolean = false
  seletedMainIndex?: number;
  selecteedSubIndex?: number;
  selectedText:string='';
  @ViewChild('op')overlayPanel: OverlayPanel | any;
  @ViewChild('selectionText')selectionText: OverlayPanel | any;


  constructor(){  }

  ngOnInit(): void {
  }

  getWords(subitem: any){
    if (typeof subitem.content === 'string') {
      return subitem.content.split(' ');
    } else if(typeof subitem.content === undefined){
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
      this.selectedText = selectedText.replace(/\n/g, ' ')
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

  isArray(item: any) {
    return Array.isArray(item);
  }

}
