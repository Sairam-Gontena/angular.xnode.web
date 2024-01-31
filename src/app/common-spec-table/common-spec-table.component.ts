import { Component, Input } from '@angular/core';

@Component({
  selector: 'xnode-common-spec-table',
  templateUrl: './common-spec-table.component.html',
  styleUrls: ['./common-spec-table.component.scss']
})
export class CommonSpecTableComponent {
  @Input() content: any;
  @Input() searchTerm: any;
  @Input() specItem: any
  @Input() users: any;
  @Input() inDiffView: any;

  showCommentIcon: boolean = false;
  commentOverlayPanelOpened: boolean = false;
  columns: any = []
  constructor() { }
  products: any = [{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  }, {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },]

  ngOnChanges() {
    if (this.content) {
      this.columns = this.setColumnsToTheTable(this.content[0])
    }
  }
  setColumnsToTheTable(data: any) {
    let cols;
    cols = Object.entries(data).map(([field, value]) => ({ field, header: this.toTitleCase(field), value }));
    return cols
  }

  toTitleCase(str: any): void {
    let words = str.split(' ');
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return words.join(' ');
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
