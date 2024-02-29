import { Component, EventEmitter, Input, Output } from '@angular/core';

type Breadcrumb = {
  label: string;
  url?: string;
};

@Component({
  selector: 'xnode-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  @Input() items!: Breadcrumb[];

  @Output() changeEvent = new EventEmitter<{ event: any }>();

  onChangeHandler(event: any) {
    console.log("Hello")
    this.changeEvent.emit(event);
  }
  // testfn(event: any) {
  //   console.log("onItemClicked", event)

  //   this.testt()
  // }

  // //   home: any = {};

  //   ngOnInit() {
  //       this.items = [
  //         { label: 'Computer' }];
  //       // this.home = { label: 'Agent', routerLink: '/' };
  //   }

  //   test = [ { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }]

  //   testt() {
  //     if(this.items.length <= this.maxVisibleItems) {
  //       this.items = [
  //         ...this.items,
  //         this.test[0]
  //       ]
  //     }else {
  //       this.items = [this.items[0], { label: '...' }];
  //     }
  //     console.log("test", this.test[0])
  //   }

  // maxVisibleItems: number = 3; // Maximum number of visible breadcrumb items
}
